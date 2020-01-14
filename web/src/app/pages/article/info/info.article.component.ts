/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2DeviceService } from 'ng2-device-detector';
import { Md5 } from 'ts-md5/dist/md5';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastyService } from 'ng2-toasty';

import { ArticleModel } from '../../../../app/shared/model/article/article.model';
import { UserModel } from '../../../../app/shared/model/user/user.model';
import { ArticleService } from '../../../../services/article.service';
import { CommonResultModel } from '../../../shared/model/result/result.model';
import { CookieUtils } from '../../../shared/utils/cookie.util';
import { CommonConfig } from '../../../../config/common.config';
import { ArticleFabulousParamModel } from '../../../shared/model/param/article.fabulous.param.model';
import { ArticleViewParamModel } from '../../../shared/model/param/article.view.param.model';
import { ArticleTypeService } from '../../../../services/article.type.service';
import { UserService } from '../../../../services/user.service';
import { CommentService } from '../../../../services/comment.service';
import { CommonPageModel } from '../../../shared/model/result/page.model';
import { CommentModel } from '../../../shared/model/comment/comment.model';
import { CodeConfig } from '../../../../config/code.config';
import { ChartsUtils } from '../../../shared/utils/chart.echarts.utils';

@Component({
    selector: 'wikift-article-info',
    templateUrl: 'info.article.component.html'
})

export class InfoArticleComponent implements OnInit {

    // 当前登录的用户
    public currentUser;
    // 文章id
    public id: number;
    // 文章内容
    public article: ArticleModel;
    // 是否可赞状态
    public fabulousStatus = true;
    // 当前时间
    public currentDay = new Date().getTime();
    // 关注按钮显示状态
    public isFollow = true;
    // 评论内容
    public commentContext;
    // 评论列表
    public comments;
    // 分页数据
    public page: CommonPageModel;
    // 当前页数
    public currentPage: number;
    public numPages = 0;
    // 评论趋势报表配置
    public showloading = true;
    // 文章一周评论趋势图
    public commentArticleThrendChart;
    // 文章一周浏览趋势图
    public visitArticleThrendChart;
    // 修改历史
    public history;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private articleService: ArticleService,
        private userService: UserService,
        private deviceService: Ng2DeviceService,
        private toastyService: ToastyService,
        private commentService: CommentService) {
        // 获取页面url传递的id参数
        this.route.params.subscribe((params) => this.id = params.id);
    }

    ngOnInit() {
        this.initArticleInfo();
    }

    initArticleInfo() {
        if (CookieUtils.getBy(CommonConfig.AUTH_USER_INFO)) {
            this.currentUser = JSON.parse(CookieUtils.getBy(CommonConfig.AUTH_USER_INFO));
        }
        const params = new ArticleModel();
        params.id = this.id;
        this.articleService.info(params).subscribe(
            result => {
                this.article = result.data;
                this.initFabulousStatus();
                this.initViewArticle();
                this.initUserFollowStatus();
                this.initComments();
                if (this.currentUser) {
                    this.initCounter();
                }
                this.initViewsCounterByWeek();
            }
        );
    }

    initFabulousStatus() {
        const fabulous = new ArticleFabulousParamModel();
        fabulous.userId = this.article.user.id;
        fabulous.articleId = this.article.id;
        if (this.currentUser) {
            this.articleService.fabulousCheck(fabulous).subscribe(
                result => {
                    if (result.data > 0) {
                        this.fabulousStatus = false;
                    }
                }
            );
        }
    }

    initViewArticle() {
        const articleView = new ArticleViewParamModel();
        articleView.userId = this.article.user.id;
        articleView.articleId = this.article.id;
        articleView.viewCount = 1;
        const hashStr = this.deviceService.userAgent + this.deviceService.browser +
            + this.deviceService.browser_version + + this.deviceService.os + this.deviceService.os_version
            + articleView.userId + articleView.articleId;
        articleView.device = Md5.hashStr(hashStr);
        this.articleService.viewArticle(articleView).subscribe(
            result => {
            }
        );
    }

    initUserFollowStatus() {
        if (this.currentUser) {
            this.userService.followCheck(this.currentUser.id, this.article.user.id).subscribe(
                result => {
                    if (result.data) {
                        this.isFollow = false;
                    }
                }
            );
        }
    }

    initComments() {
        this.commentService.getAllCommentByArticle(this.article.id, new CommonPageModel()).subscribe(
            result => {
                this.comments = result.data.content;
                this.page = CommonPageModel.getPage(result.data);
                this.currentPage = this.page.number;
            }
        );
    }

    pageChanged(event: any) {
        this.page.number = event.page - 1;
        this.page.size = event.itemsPerPage;
        this.commentService.getAllCommentByArticle(this.article.id, this.page).subscribe(
            result => {
                this.comments = result.data.content;
                this.page = CommonPageModel.getPage(result.data);
            }
        );
    }

    fabulous() {
        const fabulous = new ArticleFabulousParamModel();
        fabulous.userId = this.article.user.id;
        fabulous.articleId = this.article.id;
        this.articleService.fabulous(fabulous).subscribe(
            result => {
                this.fabulousStatus = false;
                this.initArticleInfo();
            }
        );
    }

    unFabulous() {
        const fabulous = new ArticleFabulousParamModel();
        fabulous.userId = this.article.user.id;
        fabulous.articleId = this.article.id;
        this.articleService.unfabulous(fabulous).subscribe(
            result => {
                this.fabulousStatus = true;
                this.initArticleInfo();
            }
        );
    }

    follow() {
        const follows = new Array();
        follows.push(this.article.user);
        this.currentUser.follows = follows;
        this.userService.follow(this.currentUser).subscribe(
            result => {
                if (result.data) {
                    this.isFollow = false;
                }
            }
        );
    }

    unfollow() {
        const follows = new Array();
        follows.push(this.article.user);
        this.currentUser.follows = follows;
        this.userService.unfollow(this.currentUser).subscribe(
            result => {
                if (result.data) {
                    this.isFollow = true;
                }
            }
        );
    }

    getData(value) {
        this.commentContext = value;
    }

    publishComment() {
        if (!this.commentContext) {
            this.toastyService.error('评论内容不能为空!!!');
        }
        const comment = new CommentModel();
        comment.article = this.article;
        comment.content = this.commentContext;
        comment.user = this.currentUser;
        this.commentService.createComment(comment).subscribe(
            result => {
                this.toastyService.success('评论成功');
                this.initComments();
            }
        );
    }

    deleteArticle() {
        this.articleService.delete(this.article).subscribe(
            result => {
                if (result && result.code === CodeConfig.SUCCESS) {
                    this.toastyService.success('文章 ' + this.article.title + ' 删除成功');
                    this.router.navigate(['/']);
                }
            }
        );
    }

    initCounter() {
        this.initCommentsCounter();
    }

    initCommentsCounter() {
        this.commentService.getCounterCommentsByWeekAndArticle(this.article.id).subscribe(
            result => {
                if (result && result.code === CodeConfig.SUCCESS) {
                    const xData = [], seriesData = [];
                    result.data.forEach(element => {
                        xData.push(element.dataKey);
                        seriesData.push(element.dataValue);
                    });
                    this.commentArticleThrendChart = ChartsUtils.gerenateLineChart(false, 'line', xData, seriesData);
                }
            }
        );
    }

    initViewsCounterByWeek() {
        this.articleService.getCounterViewByWeekAndArticle(this.article.id).subscribe(
            result => {
                if (result && result.code === CodeConfig.SUCCESS) {
                    const xData = [], seriesData = [];
                    result.data.forEach(element => {
                        xData.push(element.dataKey);
                        seriesData.push(element.dataValue);
                    });
                    this.visitArticleThrendChart = ChartsUtils.gerenateLineChart(false, 'line', xData, seriesData);
                }
            }
        );
    }

    deleteArticleComment(commentId) {
        this.commentService.deleteCommentById(commentId).subscribe(
            result => {
                if (result && result.code === CodeConfig.SUCCESS) {
                    this.toastyService.success('评论已经删除');
                    this.initComments();
                    this.initArticleInfo();
                }
            }
        );
    }

    showArticleHistory() {
        this.articleService.getHistory(this.article.id).subscribe(
            result => {
                if (result && result.code === CodeConfig.SUCCESS) {
                    this.history = result.data;
                }
            }
        );
    }

}
