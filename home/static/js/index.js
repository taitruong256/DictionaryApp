// var data = [
//   {
//     chu_de: "Aminal",
//     list_tu: [
//       {
//         tu: "dog",
//         loai_tu: "danh tu",
//         nghia: "chó",
//       },
//       {
//         tu: "cat",
//         loai_tu: "danh tu",
//         nghia: "mèo",
//       },
//     ],
//   },
//   {
//     chu_de: "Anime",
//     list_tu: [
//       {
//         tu: "naruto",
//         loai_tu: "danh tu",
//         nghia: "ninja",
//       },
//       {
//         tu: "connan",
//         loai_tu: "danh tu",
//         nghia: "thám tử lừng danh",
//       },
//     ],
//   },
// ];
var data = [];
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

// await console.log(data);
$(document).ready(function () {
  $(".list-group-item").click(function () {
    // Xóa lớp "active" khỏi tất cả các mục
    $(".list-group-item").removeClass("active");

    // Thêm lớp "active" vào mục được nhấp chuột
    $(this).addClass("active");

    // Cập nhật vùng nội dung dựa trên văn bản của mục được nhấp (tùy chọn)
    var tieude = $(this).text();
    $.each(data, function (index, chuDe) {
      console.log(tieude, chuDe.chu_de);
      if (tieude == chuDe.chu_de) {
        var chuDeHtml = `<h2>${chuDe.chu_de}</h2>`;
        var listTuHtml = "";
        $.each(chuDe.list_tu, function (index, tu) {
          listTuHtml += `
            <div class="item">
            <strong>${tu.tu}</strong>
            (${tu.loai_tu}) hello: ${tu.nghia}
            <a class="btn btn-outline-secondary btn-delete" href="/delete-word/${tu.id}/" data-method="delete">Delete</a>
            </div>`;
        });
        $("#content-area").html(chuDeHtml + listTuHtml);
      }
    });
  });
});

function assignItems() {
  $.each(data, function (index, chuDe) {
    var chuDeHtml = `<h2>${chuDe.chu_de}</h2>`;
    var listTuHtml = "";
    $.each(chuDe.list_tu, function (index, tu) {
      listTuHtml += `
        <div class="item">
        <strong>${tu.tu}</strong>
        (${tu.loai_tu}) hello: ${tu.nghia}
        <a class="btn btn-outline-secondary btn-delete" href="/delete-word/${tu.id}/" data-method="delete">Xóa</a>
        </div>`;
    });
    $("#content-area").append(chuDeHtml + listTuHtml);
    $("#list-group").append(
      `<a href="#" class="list-group-item list-group-item-action active">${chuDe.chu_de}</a>`
    );
  });
}

function search() {
  // lấy từ muốn search ra
  var wordToSearch = $("#wordToSearch")[0].value;

  // gọi API chỗ này
  // res = {}
  // trả về cái dict res như ở dưới

  res = {
    id: "1113",
    chu_de: "Aminal",
    tu: "dog",
    loai_tu: "danh tu",
    nghia: "chó",
  };

  // format cái kết quả cho nó đẹp
  textResult = `${res.chu_de} | ${res.tu} (${res.loai_tu}): ${res.nghia}`;

  // gắn lên front end
  $("input#searchResult").val(textResult);
}

