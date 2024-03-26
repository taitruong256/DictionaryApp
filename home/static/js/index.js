var data = [];


// Hàm này chuẩn hóa nội dung json về dạng 
// var data = [
//   {
//     "chu_de": "Aminal",
//     "list_tu": [
//       {
//         "tu":"dog",
//         "loai_tu": "danh tu",
//         "nghia": "chó",
//         "id": 1
//       },
//       {
//         "tu":"cat",
//         "loai_tu": "danh tu",
//         "nghia": "mèo"
//         "id": 2
//       }
//     ]
//   },
//   {
//       "chu_de": "Anime",
//       "list_tu": [
//         {
//           "tu":"naruto",
//           "loai_tu": "danh tu",
//           "nghia": "ninja"
//           "id": 3
//         },
//         {
//           "tu":"connan",
//           "loai_tu": "danh tu",
//           "nghia": "thám tử lừng danh"
//           "id": 4 
//         }
//       ]
//     }
// ];
async function loadItems() {
  try {
    const response = await fetch(wordListUrl);
    const newRows = await response.json();

    newRows.forEach((newRow) => {
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
    });

    // Bạn có thể thêm code để hiển thị dữ liệu lên UI ở đây
  } catch (error) {
    console.error("Error:", error);
  }
}

window.onload = async function () {
  await loadItems();
  assignItems();
};


// Hàm này để lấy data gắn vào nội dung 
function assignItems() {
  $.each(data, function (index, chuDe) {
    var chuDeHtml = `<h2>${chuDe.chu_de}</h2>`;
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
    $("#list-group").append(
      `<a href="#" class="list-group-item list-group-item-action active">${chuDe.chu_de}</a>`
    );
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
  var wordToSearch = document.getElementById("wordToSearch").value;
  console.log("Searching for:", wordToSearch);
  try {
    var response = await fetch(
      `http://127.0.0.1:8000/api/words/?search=${encodeURIComponent(
        wordToSearch
      )}`
    );
    if (!response.ok) throw new Error("Không Tìm Thấy");
    var res = await response.json(); // Sử dụng await ở đây
    console.log(res); // data giờ là một đối tượng JSON
  } catch (error) {
    console.error("Error:", error.message);
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
