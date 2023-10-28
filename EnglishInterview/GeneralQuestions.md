What is a recent technical challenge you experienced and how did you solve it?
1. big file upload
    1. Time-slice, use some browser API, just like requestIdleCallback
    2. hash file, spilt file to 2MB size chunk, find these chunk sample data, just like start, end and middle data, after find these data, compute all of these chunk's sample hash value, it will be fast than compute all of this file's hash
    3. concurrency http request, use request limit when you want to initiate multiple request
    4. slow startup, first you can upload a small content, and if uploading is more fast, and you can change you next content size, like you can upload 2MB size chunk, if it upload speed is quick, you can extend the upload size to 4MB; if it is slow you can change the upload file size to 1MB
    5. progress, when you upload some content, You can use some progress to display how much time customer need to wait and know how much data you upload
    6. when the error occur in the concurrency mode, 
    7. pause and resume
    8. at the end, you need initiate a merge request that used to inform backend merge the file
2. Drag component
    1. drop in the most near container
    2. drop in the multiple container
    3. unlimited dragger
    4. layout your dragger after drop (use flexible layout)
    5. ban some drop (use drag drop type, and like most near)
    6. drag order and layer, if you want to an dragger on the top layer or the drop first position, you need a dragger order
    7. drag mirror
    8. drag count
    9. drag nested, after drag-drop, the dragger become a new drop container
    10. polygon dragger, if you want to make a polygon dragger like a sticker or some other polygon, You need some polygon algorithm, like point include
    11. use dragger compute dragger is cube or not

