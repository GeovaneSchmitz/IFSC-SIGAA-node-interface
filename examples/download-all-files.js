const Sigaa = require ('..');
const fs = require ('fs');
const path = require ('path');

const sigaa = new Sigaa ({
  urlBase: 'https://sigaa.ifsc.edu.br'
});


// put your crendecias
var username = '';
var password = '';



let BaseDestiny = path.join ('.','downloads');

//this creates BaseDestiny
fs.mkdir(BaseDestiny, err => { 
  if (err && err.code != 'EEXIST') throw 'up'
})

let account;

sigaa.login (username, password) // login
  .then (sigaaAccount => {
    account = sigaaAccount
    return account.getClasses (sigaaAccount.token); // this return a array with all classes
  })
  .then (classes => {
    return (async () =>{
      for (let classStudent of classes) { //for each class
        console.log(classStudent.name)
        var topics = await classStudent.getTopics (); //this lists all topics
        for (let topic of topics) { //for each topic
          let attachments = topic.attachments
          for (let attachment of attachments) { 
            if (attachment.type == 'file') {
              await attachment.downloadFile(BaseDestiny);         
            }
          }
        }
      }
    })()
  })
.then (() => {
  return account.logoff() // logoff afeter finished downloads
})
.catch (data => {
    console.log (data);
  });