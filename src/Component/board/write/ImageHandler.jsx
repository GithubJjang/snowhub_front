import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
 // 1. toolbar에 등록 -> 2.toorbar에서 image 클릭시 하위 코드 활성화

            const ImageHandler = (quillRef) => {
                
                console.log("activated");
                const input = document.createElement('input'); // input 요소를 생성
                input.setAttribute('type', 'file'); // 어트리뷰터 설정 1
                input.setAttribute('accept', 'image/*'); // 어트리뷰터 설정 2
                input.click(); // 파일 선택 대화 상자를 열기 위해 <input> 요소를 클릭


                // 대화 상자에서 이미지 선택이 완료되면 실행되는 함수
                input.onchange = async () => {
                    // input.files과 Quill 편집기(quillRef.current)가 존재하는지 확인
                    // 하나라도 존재하지 않으면 함수 종료
                    if (!input.files || !quillRef.current) return;
      
                    // 선택된 파일을 변수에 file 변수에 넣어줌
                    const file = input.files[0];
              
                    const storage = getStorage();
      
                    console.log(file);
                    // Upload file and metadata to the object 'images/mountains.jpg'
                    const storageRef = ref(storage, file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    const range = quillRef.current.getEditor().getSelection(true);
      
                    // Listen for state changes, errors, and completion of the upload.
                    uploadTask.on('state_changed',
                      (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                          case 'paused':
                            console.log('Upload is paused');
                            break;
                          case 'running':
                            console.log('Upload is running');
                            break;
                        }
                      }, 
                      (error) => {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                          case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            console.log(error.code)
                            break;
                          case 'storage/canceled':
                            // User canceled the upload
                            console.log(error.code)
                            break;
      
                          // ...
      
                          case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            console.log(error.code)
                            break;
                        }
                      }, 
                      () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                          console.log('File available at', downloadURL);
                          quillRef.current.getEditor().insertEmbed(range.index, 'image', downloadURL);
                        });
                      }
                      // 사용자가 만약 하나의 이미지를 여러번 올릴 경우 -> 이미지는 1개 거기에 대한 참조는 여러개
                      // 만약 사용자가 해당 이미지를 지웠다. 그래서 firebase에서도 삭제했다.
                      // 그렇게 하면, 해당 이미지를 참조하는 나머지 이미지에 문제가 발생한다.
                      // 그 하나의 이미지만 삭제를 했는데, 나머지 동일 이미지들은 참조를 잃는다. 그래서 불러오기 불가능
                      // 용량에 손해가 있더라도, 그냥 냅두자.
                    );
                      // <- quillDummy
                };
            };


            export default ImageHandler;