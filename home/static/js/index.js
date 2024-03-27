// Load toàn bộ từ theo chủ đề dưới data base
async function loadItems(name_topic = null) {
  let data = [];
  try {
    const response = await fetch("http://127.0.0.1:8000/api/words");
    const newRows = await response.json();
    // console.log(newRows);
    newRows.forEach((newRow) => {
      if (name_topic == null) {
        let existingChuDeIndex = data.findIndex(
          (item) => item.chu_de === newRow.topic
        );

        if (existingChuDeIndex !== -1) {
          data[existingChuDeIndex].list_tu.push({
            tu: newRow.word,
            loai_tu: newRow.type,
            nghia: newRow.definition,
            id: newRow.id,
          });
        } else {
          data.push({
            chu_de: newRow.topic,
            list_tu: [
              {
                tu: newRow.word,
                loai_tu: newRow.type,
                nghia: newRow.definition,
                id: newRow.id,
              },
            ],
          });
        }
      } else if (name_topic == newRow.topic) {
        let existingChuDeIndex = data.findIndex(
          (item) => item.chu_de === newRow.topic
        );

        if (existingChuDeIndex !== -1) {
          data[existingChuDeIndex].list_tu.push({
            tu: newRow.word,
            loai_tu: newRow.type,
            nghia: newRow.definition,
            id: newRow.id,
          });
        } else {
          data.push({
            chu_de: newRow.topic,
            list_tu: [
              {
                tu: newRow.word,
                loai_tu: newRow.type,
                nghia: newRow.definition,
                id: newRow.id,
              },
            ],
          });
        }
      }
    });
    return data;
    // Bạn có thể thêm code để hiển thị dữ liệu lên UI ở đây
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

window.onload = async function () {
  $("#list-group").empty();
  $("#list-group").append(
    `<button onclick ="search_topic()" class="list-group-item list-group-item-action active" >ALL</button><div style="padding-top:5px"></div>`
  );
  let data = await loadItems();
  // console.log(data);
  assignItems(data, true);
};
async function search_topic(name_topic) {
  let data = await loadItems(name_topic);
  assignItems(data, false); // Chuyển data như một tham số
}

// Hiển thị dữ liệu vừa load, nhận data làm tham số
function assignItems(data, flag) {
  $("#content-area").empty(); // Xóa nội dung cũ
  // $("#list-group").empty(); // Tùy thuộc vào yêu cầu, có thể bạn không muốn làm điều này
  $.each(data, function (index, chuDe) {
    var chuDeHtml = `<h2 style="padding-top: 10px;">${chuDe.chu_de}</h2>`;
    var listTuHtml = "";
    $.each(chuDe.list_tu, function (index, tu) {
      listTuHtml += `
        <div class="item">
          <strong>${tu.tu}</strong>
          (${tu.loai_tu}) : ${tu.nghia}
          <button type="button" class="btn btn-primary" onclick="deleteWord(${tu.id})">Xóa</button>
          <button type="button" class="btn btn-primary edit-word" data-word-id="${tu.id}" data-bs-toggle="modal" data-bs-target="#editModal">Sửa</button>
        </div>`;
    });                               
    $("#content-area").append(chuDeHtml + listTuHtml);
    // Cập nhật #list-group nếu cần, ví dụ đối với một nút chọn topic mới
    if (flag) {
      $("#list-group").append(
        `<button onclick ="search_topic('${chuDe.chu_de}')" class="list-group-item list-group-item-action active" >${chuDe.chu_de}</button><div style="padding-top:5px"></div>`
      );
    }
  });
}


// Hàm này để lấy mã CSRF token từ cookie, vì Django yêu cầu bảo mật phải có CSRF token
function getCSRFToken() {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, 'csrftoken'.length + 1) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


// Hàm này xử lý sự kiện click nút Xóa, gửi API xuống server có method = DELETE 
function deleteWord(wordId) {
  $.ajax({
    url: `/api/delete-word/${wordId}/`,
    type: 'DELETE',
    headers: { "X-CSRFToken": getCSRFToken() }, // Lấy mã CSRF token
    success: function(response) {
      alert("Xóa từ thành công!");
      window.location.href = "";
    },
    error: function(xhr, status, error) {
      alert("Đã xảy ra lỗi khi xóa từ.");           // quay lại trang chủ 
    }
  });
}


async function search() {
  var wordToSearch = document.getElementById("wordToSearch").value.trim(); // Đảm bảo có một input field với id này để nhập từ cần tìm
  if (!wordToSearch) {
    // Kiểm tra xem chuỗi sau khi trim có phải là rỗng không
    console.log("No content to search");
    return; // Dừng hàm nếu không có nội dung để tìm kiếm
  }
  // console.log("Searching for:", wordToSearch);
  try {
    var response = await fetch(
      `http://127.0.0.1:8000/api/words/?search=${encodeURIComponent(
        wordToSearch
      )}`
    );
    if (!response.ok) throw new Error("Không Tìm Thấy");
    var words = await response.json();
    // console.log(words);

    const tableContainer = document.getElementById("tableContainer");
    const tbody = document.querySelector("#searchResultsTable tbody");
    tbody.innerHTML = ""; // Xóa các kết quả tìm kiếm cũ trước khi thêm mới

    if (words.length > 0) {
      words.forEach((word_search) => {
        const row = `<tr>
          <td>${word_search.topic}</td>
          <td>${word_search.word}</td>
          <td>${word_search.type}</td>
          <td>${word_search.definition}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
      tableContainer.classList.remove("hidden"); // Hiển thị bảng
    } else {
      tableContainer.classList.add("hidden"); // Ẩn bảng nếu không có kết quả
      // Bạn có thể thêm mã để hiển thị thông báo "Không tìm thấy kết quả"
    }
  } catch (error) {
    console.error("Error:", error.message);
    tableContainer.classList.add("hidden");
    // Xử lý lỗi, ví dụ hiển thị thông báo lỗi
  }

  // res = {
  //   id: "1113",
  //   chu_de: "Aminal",
  //   tu: "dog",
  //   loai_tu: "danh tu",
  //   nghia: "chó",
  // };


  // format cái kết quả cho nó đẹp
  res.forEach((word_search) => {
    let textResult = `${word_search.topic} | ${word_search.word} (${word_search.type}): ${word_search.definition}`;
    console.log(textResult);
    $("input#searchResult").val(textResult);
    // Nếu bạn muốn hiển thị kết quả trong một
  });
}





// Thêm sự kiện click cho nút Sửa
$(document).on('click', '.edit-word', function() {
  var wordId = $(this).data('word-id');          // Lấy id của từ từ thuộc tính data-word-id
  $('#editWordForm').attr('action', '/api/update-word/' + wordId+'/');  // Cập nhật action của form
});



// Sự kiện nút Lưu cho form sửa và gửi API có method = PUT 
$('#editWordForm').on('submit', function(event) {
  event.preventDefault(); 
  var formData = $(this).serialize();                          // Lấy dữ liệu từ form
  var csrfToken = getCSRFToken()
  // Gửi request đến API
  $.ajax({
    type: 'PUT', 
    url: $(this).attr('action'), 
    data: formData,                                           // Dữ liệu gửi đi từ form
    beforeSend: function(xhr, settings) {
      
      xhr.setRequestHeader("X-CSRFToken", csrfToken);           // Thêm csrf_token vào header của request
    },
    success: function(response) {
      alert('Đã cập nhật thành công.')
      window.location.href = "";                // quay lại trang chủ 
    },
    error: function(xhr, status, error) {
      alert("Đã xảy ra lỗi khi cập nhật. Xin hãy điền đầy đủ thông tin và thử lại.");
    }
  });
});
