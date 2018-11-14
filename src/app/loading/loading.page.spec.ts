import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { File } from '@ionic-native/file/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoadingPage } from './loading.page';
import { Events } from '@ionic/angular';
import { HttpProvider } from '../providers/http.provider';
import { Platform } from '@ionic/angular';
import { configureTestbed } from '../app.test-config';

describe('LoadingPage', () => {
  let component: LoadingPage;
  let fixture: ComponentFixture<LoadingPage>;

  beforeEach(async(() => {
    configureTestbed({
      declarations: [ LoadingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
