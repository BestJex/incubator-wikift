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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ToastyModule } from 'ng2-toasty';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AngularEchartsModule } from 'ngx-echarts';
import { SelectModule } from 'angular2-select';

import { InfoArticleComponent } from './info.article.component';

import { ArticleService } from '../../../../services/article.service';
import { WikiftEditorModule } from '../../../shared/directives/wikift-editor/wikift-editor.module';
import { UserService } from '../../../../services/user.service';
import { CommentService } from '../../../../services/comment.service';

const INFO_ARTICLE_ROUTES: Routes = [
    { path: '', component: InfoArticleComponent }
];

@NgModule({
    imports: [
        WikiftEditorModule,
        CommonModule,
        FormsModule,
        SelectModule,
        AngularEchartsModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        ToastyModule.forRoot(),
        PopoverModule.forRoot(),
        PaginationModule.forRoot(),
        Ng2DeviceDetectorModule.forRoot(),
        RouterModule.forChild(INFO_ARTICLE_ROUTES)
    ],
    exports: [],
    declarations: [
        InfoArticleComponent
    ],
    providers: [
        ArticleService,
        UserService,
        CommentService
    ],
})
export class InfoArticleModule { }
