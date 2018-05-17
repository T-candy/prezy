
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UserProvider } from '../../providers/user/user';

/*
  Generated class for the ImghandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImghandlerProvider {
  nativepath: any;
  firestore = firebase.storage();
  firedata = firebase.database().ref('/users');
  cameraImage:string;

  constructor(
    public filechooser: FileChooser,
    private camera : Camera,
    public userservice: UserProvider,
  ) {
    console.log('Hello ImghandlerProvider Provider');
  }

  // ファイルから選んで、ストレージに入れる
  // uploadimage() {
  //   var promise = new Promise((resolve, reject) => {
  //       this.filechooser.open().then((url) => {
  //         (<any>window).FilePath.resolveNativePath(url, (result) => {
  //           this.nativepath = result;
  //           (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
  //             res.file((resFile) => {
  //               var reader = new FileReader();
  //               reader.readAsArrayBuffer(resFile);
  //               reader.onloadend = (evt: any) => {
  //                 var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
  //                 var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
  //                 imageStore.put(imgBlob).then((res) => {
  //                   this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
  //                     resolve(url);
  //                   }).catch((err) => {
  //                       reject(err);
  //                   })
  //                 }).catch((err) => {
  //                   reject(err);
  //                 })
  //               }
  //             })
  //           })
  //         })
  //     })
  //   })
  //    return promise;
  // }

  // uploadimage() : Promise<any> {
  //   return new Promise(resolve => {
  //        let cameraOptions : CameraOptions = {
  //            sourceType         : this.camera.PictureSourceType.PHOTOLIBRARY,
  //            destinationType    : this.camera.DestinationType.DATA_URL,
  //            quality            : 100,
  //            targetWidth        : 100,
  //            targetHeight       : 100,
  //            encodingType       : this.camera.EncodingType.JPEG,
  //            correctOrientation : true
  //        };
  //        this.camera.getPicture(cameraOptions).then((data) => {
  //           this.cameraImage 	= "data:image/jpeg;base64," + data;
  //           resolve(this.cameraImage);
  //        });
  //     });
  //  }

   uploadimage() {
     var promise = new Promise((resolve, reject) => {
       let cameraOptions : CameraOptions = {
           sourceType         : this.camera.PictureSourceType.PHOTOLIBRARY,
           destinationType    : this.camera.DestinationType.DATA_URL,
           quality            : 100,
           // targetWidth        : 100,
           // targetHeight       : 100,
           encodingType       : this.camera.EncodingType.JPEG,
           mediaType          : this.camera.MediaType.PICTURE,
           correctOrientation : true
       };
       this.camera.getPicture(cameraOptions).then((data) => {
          this.cameraImage 	= "data:image/jpeg;base64," + data;
          resolve(this.cameraImage);
          // console.log(this.cameraImage);
          this.userservice.updateimage(this.cameraImage).then((res: any) => {
            resolve({ success: true });
          })
       }).catch((err) => {
           console.log(err);
       })
     })
      return promise;
   }

// カメラで取って保存
  picmsgstore() {
    var promise = new Promise((resolve, reject) => {
        this.filechooser.open().then((url) => {
          (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
              res.file((resFile) => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                  var uuid = this.guid();
                  var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
                  imageStore.put(imgBlob).then((res) => {
                      resolve(res.downloadURL);
                    }).catch((err) => {
                        reject(err);
                    })
                  .catch((err) => {
                    reject(err);
                  })
                }
              })
            })
          })
      })
    })
     return promise;
  }

  guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

}
