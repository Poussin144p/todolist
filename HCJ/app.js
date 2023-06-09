/**
 * Load
 */
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://todolist/PHP/tasks.php")
    .then(function (response) {
      return response.json();
    })
    .then(function (tasks) {
      tasks.map((task) => {
        displayList(task);
      });
    });
});

/**
 * Manage Task
 */
let allItems = [];
const form = document.querySelector("form");
//const list = document.querySelector("ul");
const input = document.querySelector("form input");
const select = document.querySelector("form select");
const donelist = document.getElementsByClassName("list-done")[0];
const dolist = document.getElementsByClassName("list-todo")[0];

form.addEventListener("submit", submitTask);

function submitTask(event) {
  event.preventDefault();
  let task = !input.value ? select.value : input.value.trim();

  if (task !== "") {
    addTaskInBdd(task);

    input.value = "";
    select.value = "";
  } else {
    notice("veuillez saisir une tâche !");
  }
}

function displayList(task) {
  const item = document.createElement("li");
  item.setAttribute("data-key", task.id);

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.addEventListener("click", updateItem);
  item.appendChild(input);

  if (task.status === "finish") {
    item.setAttribute("class", "ok");
    input.setAttribute("checked", "checked");
    item.setAttribute("status", "finish");
  } else {
    item.setAttribute("class", "tok");
    item.setAttribute("status", "pending");
  }

  const txt = document.createElement("span");
  txt.innerText = task.task;
  item.appendChild(txt);

  const btnUpd = document.createElement("button");
  btnUpd.setAttribute("id", "update");
  btnUpd.addEventListener("click", updateItemName);
  const btn = document.createElement("button");
  btn.setAttribute("id", "delete");
  btn.addEventListener("click", deleteItem);
  const img = document.createElement("img");
  img.setAttribute("src", "ressources/fermer.svg");
  const img2 = document.createElement("img");
  img2.setAttribute("src", "ressources/pencil.png");
  btn.appendChild(img);
  btnUpd.appendChild(img2);
  item.appendChild(btn);
  
  item.appendChild(btnUpd);

  if(item.getAttribute("class") === "ok") {
    donelist.appendChild(item);
  } else {
    dolist.appendChild(item);
  }
  allItems.push(item);
  
}



function updateItemName(e) {
  let id = e.target.parentNode.getAttribute("data-key");
  let name = e.target.parentNode.querySelector("span").innerHTML;
  console.log(name);
  let nameUpd = prompt("Changer le nom de la tâche");   
  console.log("console :" + nameUpd);
  if (nameUpd === "null") {
    return;
  }
  if (nameUpd !== "") {
    allItems.forEach((el) => {             
      if(id === el.getAttribute("data-key")) {                
        allItems = allItems.filter((li) => li.dataset.key !== el.dataset.key);
        
        var requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        fetch("http://todolist/PHP/updateName-task.php?id="+id+"&task="+nameUpd, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.log("error", error));
        
      }         
    }); 
    location.reload();  
  }
}



function deleteItem(e) {    
  let id = e.target.parentNode.getAttribute("data-key"); 
  if(e.target.parentNode.getAttribute("class")==="ok"){         
    allItems.forEach((el) => {             
      if(id === el.getAttribute("data-key")) {
        el.remove();                 
        allItems = allItems.filter((li) => li.dataset.key !== el.dataset.key);
        var requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        fetch("http://todolist/PHP/delete-task.php?id="+id, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.log("error", error));
        
      }         
    });     
  } else {
    alert("La tâche doit être terminée pour être supprimée")     
  }   
}

function itemRename(e) {
  e.target.parentNode.querySelector("#update").remove();
}

function addTaskInBdd(task) {
  var formdata = new FormData();
  formdata.append("task", task);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  fetch("http://todolist/PHP/add-task.php", requestOptions)
    .then((response) => response.json())
    .then((tasks) => tasks.map((task) => displayList(task)))
    .catch((error) => console.log("error", error));
}

function itemOk(e) {
  if (e.target.parentNode.querySelector("#update") !== null )
    button = e.target.parentNode.querySelector("#update");
  if(e.target.parentNode.getAttribute("status") === "pending") {
    e.target.parentNode.setAttribute("status", "finish");
    e.target.parentNode.setAttribute("class", "ok");
    button.remove();
    donelist.appendChild(e.target.parentNode);
  } else {
    e.target.parentNode.setAttribute("status", "pending");
    e.target.parentNode.setAttribute("class", "tok");
    e.target.parentNode.appendChild(button);
    dolist.appendChild(e.target.parentNode);
  }
}

function updateItem(e) {
  itemOk(e);
  const el = e.target.parentNode;
  const id = el.getAttribute("id");
  const status = el.getAttribute("status");

  const url = ("http://todolist/PHP/update-task.php?id="+id+"&status="+status);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
}



function notice(message) {
  alert(message);
}
