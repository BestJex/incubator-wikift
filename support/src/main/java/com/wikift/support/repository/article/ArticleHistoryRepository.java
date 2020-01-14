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
package com.wikift.support.repository.article;

import com.wikift.model.article.ArticleEntity;
import com.wikift.model.article.ArticleHistoryEntity;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

/**
 * ArticleHistoryRepository <br/>
 * 描述 : ArticleHistoryRepository <br/>
 * 作者 : qianmoQ <br/>
 * 版本 : 1.0 <br/>
 * 创建时间 : 2018-02-02 下午3:16 <br/>
 * 联系作者 : <a href="mailTo:shichengoooo@163.com">qianmoQ</a>
 */
public interface ArticleHistoryRepository extends PagingAndSortingRepository<ArticleHistoryEntity, Long> {

    /**
     * 根据文章查询改文章的修改历史
     *
     * @param entity 修改的文章
     * @return 文章修改历史
     */
    List<ArticleHistoryEntity> findByArticle(ArticleEntity entity);

    /**
     * 根据修改历史版本查找文章历史修改内容
     *
     * @param version 文章修改历史
     * @return 文章内容
     */
    ArticleHistoryEntity findByVersionAndArticle(String version, ArticleEntity entity);

}
