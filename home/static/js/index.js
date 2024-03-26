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
        <a class="btn btn-outline-secondary btn-delete" href="/api/delete-word/${tu.id}/" data-method="delete">Xóa</a>    
        </div>`;
    });                                      // thêm thẻ a để link tới url gọi api/delete-word/id để xóa, thẻ a dùng method = GET nên bị lỗi
    $("#content-area").append(chuDeHtml + listTuHtml);
    $("#list-group").append(
      `<a href="#" class="list-group-item list-group-item-action active">${chuDe.chu_de}</a>`
    );
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

