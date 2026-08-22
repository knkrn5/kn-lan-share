const fileSearch = document.querySelector("#fileSearch");
const fileRows = Array.from(document.querySelectorAll("#dirs .file-row"));
const fileSearchCount = document.querySelector("#fileSearchCount");
const fileSearchEmpty = document.querySelector("#fileSearchEmpty");

function filterFiles() {
  const query = fileSearch.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  fileRows.forEach((row) => {
    const fileName = row.querySelector(".file-name")?.textContent ?? "";
    const matches = fileName.toLocaleLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (fileSearchCount) {
    fileSearchCount.textContent = query
      ? `${visibleCount} of ${fileRows.length}`
      : `${fileRows.length} items`;
  }

  if (fileSearchEmpty) {
    fileSearchEmpty.hidden = visibleCount !== 0;
  }
}

if (fileSearch) {
  fileSearch.addEventListener("input", filterFiles);
  filterFiles();
}
