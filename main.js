const btnMonthPrev = document.querySelector(".ctrl .btnMonthPrev");
const btnMonthNext = document.querySelector(".ctrl .btnMonthNext");
let dateNow = new Date(new Date().getFullYear(), new Date().getMonth(),1);
let maxDays = 8;
let startDate = "";
let endDate = "";
let canSelect = true;
let bookingList = [
  "2023-9-13",
  ["2023-9-15", "2023-9-22"],
  ["2023-10-2", "2023-10-6"],
  ["2023-10-22", "2023-10-26"],
  ["2023-11-15", "2023-11-17"]
  ];
bookingList = bookingList.reduce((acc, item) => {
  if (Array.isArray(item)) {
    acc.push(...getDatesArray(...item));
  } else {
    acc.push(item);
  }
  return acc;
}, []);
console.log(bookingList)

if(startDate !== ""){
  dateNow = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth(),1)
}

setCalendar();

btnMonthNext.addEventListener("click", (evt) => {
  let newMonth = dateNow.getMonth()+1;
  dateNow = new Date(dateNow.getFullYear(),newMonth,1);
  setCalendar();
});

btnMonthPrev.addEventListener("click", (evt) => {
  let newMonth = dateNow.getMonth()-1;
  dateNow = new Date(dateNow.getFullYear(),newMonth,1);
  setCalendar();
});

function setCalendar(){
  let totalDays = new Date(dateNow.getFullYear(),dateNow.getMonth()+1,0).getDate();
  let firstDay = dateNow.getDay();
  
  const mainLine1 = document.querySelector(".mLeft .mainLine");
  const info1 = document.querySelector(".mLeft .info");
  info1.innerHTML = dateNow.getFullYear()+"-"+(dateNow.getMonth()+1).toString().padStart(2,"0");
  let dayHtml1 = "";
  for(let i=1;i<=totalDays;i++){
    let date = new Date(dateNow.getFullYear(),dateNow.getMonth(),i);
    let day = date.getDay();
    let template = `<div class="day date date${i} day${day}" date="${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}">${i}</div>`;
    dayHtml1+=template;
  }
  mainLine1.innerHTML = dayHtml1;
  // 每個月第一天的縮排，寫法會和週日是第一天或最後一天有關
  // 目前這寫法是週日為最後一天
  const date1 = document.querySelector(".date1");
  if(firstDay === 0){
    firstDay = 7;
  }
  date1.style.marginLeft = ((firstDay-1)*40)+"px";

  let dates = document.querySelectorAll(".calendar .date");
  dates.forEach((dateBtn)=>{
    let thisDate = dateBtn.getAttribute("date");
    if(bookingList.includes(thisDate)){
      dateBtn.classList.add("disabled");
    }
    if(startDate !== "" && endDate === ""){
      if(startDate === thisDate){
        dateBtn.classList.add("started");
      }
    }
    if(startDate !== "" && endDate !== ""){
      colorSelected();
    }
    if(canSelect === true){
      dateBtn.addEventListener("click",function(event){
        let date = event.currentTarget.getAttribute("date");
        if(startDate !== "" && endDate !== ""){
          // 如果已經有註記了起始與結束日期，就清掉重置
          startDate = "";
          endDate = "";
          resetSelected();
        }
        if(startDate === ""){
          // 如果 startDate 是空字串，就把按下的那個變成 startDate
          startDate = date;
          this.classList.add("started");
        }else if(endDate === ""){
          endDateCheck(date, this);
        }
    });
    }
  })
}

function endDateCheck(date, target){
  // 檢查是不是能被選，預設是可以被點選變成 endDate
  let canSet = true;
  let alertInfo = "";
  // 判斷結束日期是不是小於起始日期
  if(new Date(date) < new Date(startDate)){
    canSet = false;
    alertInfo = "不能夠往起始日期的前面日期選";
  }
  // 判斷選擇區間是否包含 disabled 的日期
  bookingList.forEach((date1)=>{
    if(new Date(date1) > new Date(startDate) && new Date(date1) < new Date(date)){
      canSet = false;
      alertInfo = "選取的區間有無法預定的日期";
    }
  })
  // 判斷是否大於最大可選天數
  let passDays = parseInt((new Date(date) - new Date(startDate))/1000/60/60/24)+1
  if(passDays>maxDays){
    canSet = false;
    alertInfo = "目前選取天數多於可支援天數";
  }
  // 總結判斷結果
  if(canSet === true){
    endDate = date;
    target.classList.add("started");
    colorSelected();
  }else{
    alert(alertInfo);
    startDate = "";
    endDate = "";
    resetSelected();
  }
}

function colorSelected(){
  let dates = document.querySelectorAll(".calendar .date");
  dates.forEach((dateBtn)=>{
    dateBtn.classList.remove("started");
    let date = dateBtn.getAttribute("date");
    if(date === startDate){
      dateBtn.classList.add("selectedStart");
    }
    if(new Date(date) > new Date(startDate) && new Date(date) < new Date(endDate)){
      dateBtn.classList.add("selectedInclude");
    }
    if(date === endDate){
      dateBtn.classList.add("selectedEnd");
    }
  });
}

function resetSelected(){
  let dates = document.querySelectorAll(".calendar .date");
  dates.forEach((dateBtn)=>{
    dateBtn.classList.remove("started");
    dateBtn.classList.remove("selectedStart");
    dateBtn.classList.remove("selectedEnd");
    dateBtn.classList.remove("selectedInclude");
  });
}

function getDatesArray(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const datesArray = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    datesArray.push(`${year}-${month}-${date}`);
  }

  return datesArray;
}