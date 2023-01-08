async function getUsers() {
  let res = await fetch("http://api/");
  let users = await res.json();

  console.log(users);

  users.forEach((user) => {
    document.getElementById("list").innerHTML += `
        <tr>
        <th>${user.date}</th>
        <th>${user.first_name}</th>
        <th>${user.last_name}</th>
        </tr>
        `;
  });
}

async function addUser() {
  const fName = document.getElementById("fName").value;
  const lName = document.getElementById("lName").value;
  const date = document.getElementById("date").value;

  let formData = new FormData();
  formData.append("fName", fName);
  formData.append("lName", lName);
  formData.append("date", date);

  const res = await fetch("http://api/", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.status === true) {
    await getUsers();
  }
}

getUsers();

var downPdf = document.getElementById("renderPdf");

downPdf.onclick = function () {
  downPdf.style.display = "none";
  html2canvas(document.body, {
    onrendered: function (canvas) {
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;

      // Одна страница PDF-файла отображает высоту холста, созданного HTML-страницей;
      var pageHeight = (contentWidth / 592.28) * 841.89;
      // Высота html-страницы без создания pdf
      var leftHeight = contentHeight;
      // Смещение страницы
      var position = 0;
      // Размер бумаги формата A4 [595,28,841,89], ширина и высота холста, создаваемого страницей html в pdf
      var imgWidth = 595.28;
      var imgHeight = (592.28 / contentWidth) * contentHeight;

      var pageData = canvas.toDataURL("image/jpeg", 1.0);

      var pdf = new jsPDF("", "pt", "a4");

      // Следует различать две высоты: одна - это фактическая высота html-страницы и высота страницы, которая генерирует pdf (841.89)
      // Когда содержимое не превышает диапазон, отображаемый на одной странице pdf, страницы нет необходимости
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          // Избегайте добавления пустых страниц
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save("content.pdf");
    },
  });
  downPdf.style.display = "block";
};
