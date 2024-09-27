let xmlDoc;
let loadedList = [];
let checkBoxId = 0;
let likedCounter = 0;
let likedList = [];
let intelSockets = ["Socket SP3", "Socket SP6", "Socket 1700", "Socket 4677"];
let amdSockets = ["Socket SP5", "Socket AM4", "Socket AM5", "Socket sTR5"];
function loadXMLDoc() {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      xmlDoc = this.responseXML;
      parseXML();
      loadFilters();
      ispisi();
    }
  };
  xmlhttp.open("GET", "../assets/processors.xml", true);
  xmlhttp.send();
}

function parseXML() {
  const processors = xmlDoc.getElementsByTagName("Processor");

  for (let i = 0; i < processors.length; i++) {
    let processor = processors[i];
    let processorObj = {};

    processorObj.Name = processor.getElementsByTagName("Name")[0].textContent;
    processorObj.Codename =
      processor.getElementsByTagName("Codename")[0].textContent;
    processorObj.Cores = processor.getElementsByTagName("Cores")[0].textContent;
    processorObj.Clock = processor.getElementsByTagName("Clock")[0].textContent;
    processorObj.Socket =
      processor.getElementsByTagName("Socket")[0].textContent;
    processorObj.Process =
      processor.getElementsByTagName("Process")[0].textContent;
    processorObj.L3Cache =
      processor.getElementsByTagName("L3Cache")[0].textContent;
    processorObj.TDP = processor.getElementsByTagName("TDP")[0].textContent;
    processorObj.Released =
      processor.getElementsByTagName("Released")[0].textContent;
    processorObj.liked = false;
    processorObj.id = i;

    loadedList.push(processorObj);
  }
  loadedList = loadedList
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

function loadFilters() {
  let processDom = document.querySelector(".processDrop");
  let processes = loadedList.map((e) => e.Process);
  let newProcesses = Array.from(new Set(processes));
  let socketDom = document.querySelector(".socketDrop");
  let socketList = Array.from(new Set(loadedList.map((e) => e.Socket)));
  for (const x of newProcesses) {
    processDom.innerHTML += `
              <div>
                <input id="cb${checkBoxId}" type="checkbox" value="${x}" data-use="Process" onclick="ispisi()"/>
                <label for="cb${checkBoxId++}">${x}</label>
              </div>
`;
  }
  for (const x of socketList) {
    socketDom.innerHTML += `
              <div>
                <input id="cb${checkBoxId}" type="checkbox" value="${x}" data-use="Socket" onclick="ispisi()"/>
                <label for="cb${checkBoxId++}">${x}</label>
              </div>
`;
  }
}
loadXMLDoc();

let manufacturingDom = document.querySelectorAll(".filterElem");
let allDoms = document.querySelectorAll(".filterDropDown");
for (const x of manufacturingDom) {
  x.onclick = () => {
    for (const y of allDoms) {
      if (x.id == y.id) {
        y.classList.toggle("hide");
      }
    }
  };
}

function intelOrAmd(x) {
  if (intelSockets.includes(x.Socket)) return "../assets/intel.png";
  return "../assets/amd.png";
}

function filter(x) {
  let inputDom = document.querySelector("#search");
  let isInput = x.Name.toLowerCase().includes(inputDom.value.toLowerCase());
  const checkboxes = document.querySelectorAll(".filterElems input");

  let socketFilters = new Set();
  let processFilters = new Set();
  let tdpFilters = new Set();

  for (const checkbox of checkboxes) {
    let typeOfCheckbox = checkbox.dataset.use;
    if (checkbox.checked) {
      if (typeOfCheckbox === "Socket") {
        socketFilters.add(checkbox.value);
      } else if (typeOfCheckbox === "Process") {
        processFilters.add(checkbox.value);
      } else if (typeOfCheckbox === "Tdp") {
        tdpFilters.add(parseInt(checkbox.value));
      }
    }
  }

  let isSocket = socketFilters.size === 0 || socketFilters.has(x.Socket);
  let isProcess = processFilters.size === 0 || processFilters.has(x.Process);
  let isTdp = tdpFilters.size === 0 || tdpFilters.has(getTdpRange(x.TDP));

  let conditionsMet = isInput && isSocket && isProcess && isTdp;

  return conditionsMet;
}

function getTdpRange(tdp) {
  const tdpValue = parseInt(tdp);
  if (tdpValue >= 0 && tdpValue < 100) {
    return 100;
  } else if (tdpValue >= 100 && tdpValue < 200) {
    return 200;
  } else if (tdpValue >= 200 && tdpValue < 300) {
    return 300;
  } else if (tdpValue >= 300 && tdpValue < 400) {
    return 400;
  }
}

function deleteALike(e) {
  likedList = likedList.filter((x) => x.id != e.id);
  for (let i = 0; i < loadedList.length; i++) {
    if (loadedList[i].id == e.id) {
      loadedList[i].liked = false;
      console.log(loadedList[i]);
      console.log(e.id);
      break;
    }
  }
  likedCounter--;
  let heartDom = document.querySelector(".heartGroup h1");
  heartDom.innerText = likedCounter;
  ispisiLajkove();
  ispisi();
}
function ispisiLajkove() {
  let grid = document.querySelector(".grid-container");
  grid.textContent = "";
  grid.innerHTML += `
              <div class="grid-item header-item">Name</div>
              <div class="grid-item header-item">Process</div>
              <div class="grid-item header-item">TDP</div>
              <div class="grid-item header-item">Socket</div>
              <div class="grid-item header-item">Action</div>
`;
  for (const x of likedList) {
    grid.innerHTML += `
              <div class="grid-item">${x.Name}</div>
              <div class="grid-item">${x.Process}</div>
              <div class="grid-item">${x.TDP}</div>
              <div class="grid-item">${x.Socket}</div>
              <div class="grid-item">
                <button class="delete-button" onclick="deleteALike(this)" id="${x.id}">Delete</button>
              </div>
`;
  }
}

function likes(e) {
  let i;
  for (i = 0; i < loadedList.length; i++) {
    if (loadedList[i].id == e.id) {
      break;
    }
  }

  if (e.classList.contains("liked")) {
    likedCounter--;
    likedList = likedList.filter((x) => x.id != e.id);
    loadedList[i].liked = false;
  } else {
    likedCounter++;
    let elem = loadedList.filter((x) => x.id == e.id)[0];
    likedList.push(elem);
    loadedList[i].liked = true;
  }

  e.classList.toggle("liked");
  let heartDom = document.querySelector(".heartGroup h1");
  heartDom.innerText = likedCounter;
  ispisiLajkove();
}

function ispisi() {
  let filterListDom = document.querySelector(".filteredList");
  filterListDom.textContent = "";
  for (const x of loadedList) {
    if (filter(x)) {
      filterListDom.innerHTML += `
        <div class="cpuClass">
          <div class="image" style="background-image: url('${intelOrAmd(
            x
          )}');"></div>
          <div class="description">
            <h1>Name: ${x.Name}</h1>
            <h2>Process: ${x.Process}</h2>
            <h3>TDP: ${x.TDP}</h3>
            <h3>Socket: ${x.Socket}</h3>
            ${
              x.liked
                ? `<div class="heartGroup cursor-hover like liked" onclick="likes(this)" id="${x.id}"></div>`
                : `<div class="heartGroup cursor-hover like" onclick="likes(this)" id="${x.id}"></div>`
            }
          </div>
        </div>
      `;
    }
  }
}

function clearAll() {
  let clearDom = document.querySelector(".clearAllButton");
  const checkboxes = document.querySelectorAll(".filterElems input");
  for (const x of checkboxes) {
    x.checked = false;
  }
  ispisi();
}

let filterElemDoms = document.querySelectorAll(".filterElem");
for (const filterElemDom of filterElemDoms) {
  let dropDownDom = Array.from(
    document.querySelectorAll(".filterDropDown")
  ).filter((x) => x.id == filterElemDom.id)[0];
  let svg = filterElemDom.querySelector(".dropDownSvg");
  filterElemDom.onclick = () => {
    svg.classList.toggle("rotated");
    dropDownDom.classList.toggle("hide");
  };
}

document.addEventListener("click", (e) => {
  let heartGroupDom = document.querySelector(".heartGroup");
  let likedListDom = document.querySelector(".savedList");
  if (likedListDom.contains(e.target)) {
    return;
  } else if (heartGroupDom.contains(e.target)) {
    likedListDom.classList.toggle("hide");
  } else {
    if (e.target.classList.contains("delete-button")) return;
    likedListDom.classList.add("hide");
  }
});

function logout() {
  window.location.href = "/login/login.html";
}
