let requestUrl = `http://localhost:8080`;

const MessageTypeEnum = Object.freeze({
  CONNECT: 0,
  ADD: 1,
  SEARCH: 2,
  DELETE: 3,
});

const ResultEnum = Object.freeze({
  FAIL: 0,
  SUCCESS: 1,
});

class MemberData {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
  }
}

const ws = new WebSocket(`ws://localhost:8080`);
let clientID = "clientID-" + parseInt(Math.random() * 1000000);

function sendDataToWebSocket(type, data) {
  var msg = {
    type: type,
    data: data,
    id: clientID,
    date: Date.now(),
  };
  ws.send(JSON.stringify(msg));
}

ws.onopen = function open() {
  sendDataToWebSocket(MessageTypeEnum.CONNECT, `client websocket connected`);
};

ws.onmessage = function onMessage(message) {
  // console.log(message);
  alert(message.data);
};

class Member {
  constructor(id, password, nickname) {
    this.id = id;
    this.password = password;
    this.nickname = nickname;
  }
}

window.onload = function () {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status === 200) {
    }
  };

  document.getElementById(`btn_add_member`).addEventListener(
    `click`,
    function () {
      requestPostMember(requestUrl + `/member`, function (result, data) {
        if (result === ResultEnum.SUCCESS) {
          let alertText = `${data.id}(${data.nickname}) 님이 가입되었습니다.`;
          sendDataToWebSocket(MessageTypeEnum.ADD, alertText);
        } else if (result === ResultEnum.FAIL) {
          alert(`이미 존재하는 회원입니다.`);
        }
      });
    },
    false
  );
  document
    .getElementById(`btn_reset_input`)
    .addEventListener(`click`, function () {
      Reset.resetCreateMemberFormInput();
    });
  document
    .getElementById(`btn_search_member`)
    .addEventListener(`click`, function () {
      let id = document.getElementById("find_id").value;
      requestGetMember(requestUrl + `/member/` + id, function (result, data) {
        if (result === ResultEnum.SUCCESS) {
          let alertText = `${data.id}(${data.nickname}) 님이 검색되었습니다.`;
          sendDataToWebSocket(MessageTypeEnum.SEARCH, alertText);
        } else if (result === ResultEnum.FAIL) {
          alert(`회원 계정이 없습니다.`);
        }
      });
    });
  document
    .getElementById(`btn_change_member_info`)
    .addEventListener(`click`, function () {
      let id = document.getElementById("find_id").value;
      requestPutMember(requestUrl + `/member/` + id, function (result) {
        alert(result);
      });
    });
  document
    .getElementById(`btn_remove_member`)
    .addEventListener(`click`, function () {
      let id = document.getElementById("find_id").value;
      requestDeleteMember(
        requestUrl + `/member/` + id,
        function (result, data) {
          if (result === ResultEnum.SUCCESS) {
            let alertText = `${data.id}(${data.nickname}) 님이 삭제되었습니다.`;
            sendDataToWebSocket(MessageTypeEnum.DELETE, alertText);
          } else if (result === ResultEnum.FAIL) {
            alert(`회원 계정이 없습니다.`);
          }
        }
      );
    });
};

/////// GET ///////
function requestGetMember(dataUrl, callback) {
  requestAjax(`GET`, dataUrl, null, function () {
    if (this.readyState === 4 && this.status === 200) {
      document.getElementById("find_password").value = JSON.parse(
        this.responseText
      ).password;
      document.getElementById("find_nickname").value = JSON.parse(
        this.responseText
      ).nickname;
      callback(ResultEnum.SUCCESS, JSON.parse(this.responseText));
    } else if (this.readyState === 4 && this.status === 404) {
      callback(ResultEnum.FAIL);
    }
  });
}

/////// POST //////
function requestPostMember(dataUrl, callback) {
  let id = document.getElementById("new_id").value;
  let password = document.getElementById("new_password").value;
  let nickname = document.getElementById("new_nickname").value;
  let member = new Member(id, password, nickname);

  requestAjax(`POST`, dataUrl, JSON.stringify(member), function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(ResultEnum.SUCCESS, JSON.parse(this.responseText));
    } else if (this.readyState === 4 && this.status === 409) {
      callback(ResultEnum.FAIL);
    }
  });
  Reset.resetCreateMemberFormInput();
}

////// PUT ///////
function requestPutMember(dataUrl, callback) {
  let id = document.getElementById("find_id").value;
  let password = document.getElementById("find_password").value;
  let nickname = document.getElementById("find_nickname").value;
  let member = new Member(id, password, nickname);

  requestAjax(`PUT`, dataUrl, JSON.stringify(member), function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(ResultEnum.SUCCESS);
    } else if (this.readyState === 4 && this.status === 404) {
      callback(ResultEnum.FAIL);
    }
  });
  Reset.resetManageMemberFormInput();
}

////// DELETE /////
function requestDeleteMember(dataUrl, callback) {
  requestAjax(`DELETE`, dataUrl, null, function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(ResultEnum.SUCCESS, JSON.parse(this.responseText));
    } else if (this.readyState === 4 && this.status === 404) {
      callback(ResultEnum.FAIL);
    }
  });
  Reset.resetManageMemberFormInput();
}

function requestAjax(method, dataUrl, requestBody, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = callback;
  xhttp.open(method, dataUrl);
  switch (method) {
    case `GET`:
    case `DELETE`:
      xhttp.send();
      break;
    case `POST`:
    case `PUT`:
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(requestBody);
      break;
  }
}

class Reset {
  static resetCreateMemberFormInput() {
    document.getElementById("new_id").value = "";
    document.getElementById("new_password").value = "";
    document.getElementById("new_nickname").value = "";
  }

  static resetManageMemberFormInput() {
    document.getElementById("find_id").value = "";
    document.getElementById("find_password").value = "";
    document.getElementById("find_nickname").value = "";
  }
}
