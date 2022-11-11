// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down");



 var trash = document.getElementsByClassName("delete");
const image_input = document.querySelector("#image-input");
const profileImage_input = document.querySelector("#profileImage-input");
const editpen = document.getElementsByClassName('edit');


console.log(editpen)
Array.from(editpen).forEach((icon) =>{
  icon.addEventListener('click', (e)=> {
    e.preventDefault()
    const blexEx = e.target.parentNode.childNodes[7]
    blexEx.focus()
    blexEx.addEventListener('keyup', editblexEx)
  })
})
function editblexEx(e){
  const newText = e.target.value
  const _id = e.target.parentNode.getAttribute('id').trim()
  console.log(_id)
  fetch('edit', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                newText, _id
              })
            })
            .then(response => {
              if (response.ok) return response.json()
            })
            .then(data => {
              console.log(data)
              //window.location.reload(true)
            })
}

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});

profileImage_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector(".profilePic").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(e){
    e.preventDefault()
    const _id = e.target.parentNode.getAttribute('id').trim() 
    const imgSrc = e.target.parentNode.childNodes[5].childNodes[0].currentSrc
    const splitSrc = imgSrc.split('/')
    const cloudinaryid = splitSrc[splitSrc.length -1].split('.')[0]
    console.log(e.target.parentNode.childNodes[5].childNodes[0].currentSrc)
    console.log(_id)
    console.log(cloudinaryid)
    fetch('trashd', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
         "_id": _id, 
         "cloudinaryid": cloudinaryid
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      
      window.location.reload(true)
    })
  });
});
// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// Array.from(thumbDown).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//     fetch('messages', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'thumbUp':thumbUp -2
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });


