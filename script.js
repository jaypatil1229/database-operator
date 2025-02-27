const tabs = document.querySelectorAll(".tab");
const tabContent = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active-tab"));
    tabContent.forEach((item) => item.classList.remove("active-tab-content"));
    tab.classList.add("active-tab");
    document
      .querySelector(`#${tab.dataset.target}`)
      .classList.add("active-tab-content");

    //check if the tab is insert data tab and load the table names
    if (tab.dataset.target === "insert-tab-content") {
      setTableNames("insert");
    }
    if (tab.dataset.target === "update-tab-content") {
      setTableNames("update");
    }
    if (tab.dataset.target === "delete-tab-content") {
      setTableNames("delete");
    }
  });
});

const setTableNames = (type) => {
  //fetch table names from /database-operator/get-all-tables.php
  fetch("/database-operator/get-all-tables.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const tableSelect = document.querySelector(
          `#${type}-table-name-select`
        );

        tableSelect.innerHTML = `<option value="" disabled selected>Select a table</option>`;
        data.data.forEach((table) => {
          const option = document.createElement("option");
          option.value = table.table_name;
          option.textContent = table.table_name;
          tableSelect.appendChild(option);
        });
      } else {
        alert(data.message || "Failed to fetch tables");
      }
    });
};

const getTableStructure = async (tableName) => {
  //fetch the table structure from /database-operator/get-table-structures.php
  const response = await fetch(
    "/database-operator/get-table-structures.php?table_name=" + tableName
  );
  const data = await response.json();
  return data.status === "success" ? data.data : [];
};

const handleTableSelectChange = (event) => {
  const tableName = event.target.value;
  if (tableName === "") {
    return;
  }

  getTableStructure(tableName).then((data) => {
    if (data.length === 0) {
      alert("No data found in the table");
      return;
    }
    populateTableStructure(data);
  });
};

const populateTableStructure = (data) => {
  const structureContainer = document.querySelector(
    "#insert-record-input-fields"
  );
  structureContainer.innerHTML = "";
  data.forEach((column, index) => {
    //determine the input type based on the column type
    let inputType = "text";

    if (column.Type.includes("int")) {
      inputType = "number";
    } else if (column.Type.includes("date")) {
      inputType = "date";
    } else if (column.Type.includes("time")) {
      inputType = "time";
    }

    //create the input field
    const div = document.createElement("div");
    div.className = "input-field flex gap-2 items-center";
    div.innerHTML = `<label for="${column.Field}" class="font-semibold">${column.Field}</label>
                            <input type="${inputType}" name="${column.Field}" id="${column.Field}"
                                placeholder="Enter ${column.Field}" required class="p-2 rounded-xl border">`;
    structureContainer.appendChild(div);
  });
};

let columnFieldColumnCount = 1;
const addColumnField = () => {
  columnFieldColumnCount = columnFieldColumnCount + 1;
  console.log("columnFieldColumnCount", columnFieldColumnCount);

  const parentContainer = document.querySelector("#table-columns-input-fields");
  const clutter = `<div>
                      <label for="column-name-${columnFieldColumnCount}" class="font-semibold">Column Name</label>
                      <input type="text" name="column-name-${columnFieldColumnCount}" id="column-name-${columnFieldColumnCount}"
                          placeholder="Enter the column name" required class="p-2 rounded-xl border">
                    </div>
                    <div>
                        <label for="column-datatype-${columnFieldColumnCount}" class="font-semibold">Column Datatype</label>
                        <select name="column-datatype-${columnFieldColumnCount}" id="column-datatype-${columnFieldColumnCount}" required
                            class="p-2 rounded-xl border cursor-pointer">
                            <option value="INT">INT</option>
                            <option value="VARCHAR">VARCHAR</option>
                            <option value="TEXT">TEXT</option>
                            <option value="DATE">DATE</option>
                            <option value="TIME">TIME</option>
                            <option value="CHAR">CHAR</option>
                        </select>
                    </div>
                    <div class="ml-auto flex items-center mr-10">
                      <button type="button"
                          onclick="deleteColumnField('create-table-column-field-${columnFieldColumnCount}')"
                          class="w-6 h-6 flex items-center justify-center text-red-500 text-2xl rounded-full cursor-pointer">
                          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                              fill = "currentColor" class="bi bi-x"
                              viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                              <path
                                  d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                          </svg>
                      </button>
                  </div>`;

  const div = document.createElement("div");
  div.id = `create-table-column-field-${columnFieldColumnCount}`;
  div.className = "column-input flex gap-10 items-center";
  div.innerHTML = clutter;
  parentContainer.appendChild(div);
};

const deleteColumnField = (id) => {
  console.log("deleteColumnFieldColumnCount", columnFieldColumnCount);
  if (columnFieldColumnCount > 1) {
    //remove the field with id as id
    // console.log(document.getElementById(id));
    document.getElementById(id).remove();
    columnFieldColumnCount = columnFieldColumnCount - 1;
  }
};

const handleCreateTableSubmit = (event) => {
  event.preventDefault();
  //extract the form data and validate it
  const formData = new FormData(event.target);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  let isValid = true;

  //check table_name input field has a value and must follow database table name rules
  const tableName = formObject["table-name"];
  if (tableName === "") {
    alert("Table name cannot be empty");
    isValid = false;
  }
  //check that the table name follows the database table name rules such no whitespace, no special characters, no reserved keywords
  const tableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  if (!tableNameRegex.test(tableName)) {
    alert(
      "Table names must start with a letter or an underscore and must not contain any special characters or whitespace"
    );
    isValid = false;
  }

  //check that each column name input field has a value and must be unique and must follow database column name rules
  const columnNames = [];
  for (let i = 1; i <= columnFieldColumnCount; i++) {
    const columnName = formObject[`column-name-${i}`];
    if (columnName === "") {
      alert("Column name cannot be empty");
      isValid = false;
    }
    if (columnNames.includes(columnName)) {
      alert("Column names must be unique");
      isValid = false;
    }
    //check that the column name follows the database column name rules such no whitespace, no special characters, no reserved keywords
    const columnNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!columnNameRegex.test(columnName)) {
      alert(
        "Column names must start with a letter or an underscore and must not contain any special characters or whitespace"
      );
      isValid = false;
    }

    columnNames.push({
      column_name: columnName,
      column_datatype: formObject[`column-datatype-${i}`],
    });

    console.log("columnNames", columnNames);
  }

  //   return isValid;

  if (!isValid) {
    return;
  }
  //   console.log("columnNames", columnNames);

  //submit the form data to the server
  const url = "/database-operator/create-table.php";
  const options = {
    method: "POST",
    body: JSON.stringify({
      table_name: tableName,
      columns: columnNames,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        alert("Table created successfully");
        //clear the form fields
        event.target.reset();
        //reset the column field count
        columnFieldColumnCount = 1;
        //remove the column input fields
        const parentContainer = document.querySelector(
          "#table-columns-input-fields"
        );
        //remove all the child nodes except the first one
        while (parentContainer.children.length > 1) {
          parentContainer.removeChild(parentContainer.lastChild);
        }
      } else {
        alert(data.message || "Table creation failed");
      }
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
};

const handleInsertRecordSubmit = (event) => {
  event.preventDefault();
  //extract the form data and validate it
  const formData = new FormData(event.target);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  let isValid = true;

  //check table_name select field has a value
  const tableName = formObject["table-name-select"];
  if (tableName === "") {
    alert("Table name cannot be empty");
    isValid = false;
  }

  //check that all the input fields have a value
  for (const key in formObject) {
    if (key !== "table-name-select" && formObject[key] === "") {
      alert("All fields are required");
      isValid = false;
      break;
    }
  }

  if (!isValid) {
    return;
  }

  const record = {};
  for (const key in formObject) {
    if (key !== "table-name-select") {
      record[key] = formObject[key];
    }
  }

  //submit the form data to the server with table_name and record as the column name and value pairs not including the table_name
  const url = "/database-operator/insert.php";
  const options = {
    method: "POST",
    body: JSON.stringify({
      table_name: tableName,
      record: record,
    }),

    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        alert("Record inserted successfully");

        //clear the form fields
        event.target.reset();
        //remove the column input fields
        const parentContainer = document.querySelector(
          "#insert-record-input-fields"
        );
        //remove all the child nodes as its insert tab
        parentContainer.innerHTML = "";
      } else {
        alert(data.message || "Record insertion failed");
      }
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
};

const getTableData = async (tableName) => {
  try {
    //fetch the table data from /database-operator/get-table-data.php
    const response = await fetch(
      "/database-operator/get-table-data.php?table_name=" + tableName
    );
    const data = await response.json();
    return data.status === "success" ? data.data : [];
  } catch (error) {
    console.log("Error:", error.message);
    return [];
  }
};

const handleUpdateRecordSubmit = async (
  tableName,
  tableHeaders,
  updatedData
) => {
  //check if the row data is empty or individual fields are empty
  if (!updatedData) {
    alert("No data found to update");
    return;
  }

  let isValid = true;

  //check that all the input fields have a value
  for (const key in updatedData) {
    if (updatedData[key] === "") {
      alert("All fields are required");
      isValid = false;
      break;
    }
  }

  if (!isValid) {
    alert("All fields are required");
    return;
  }

  let record = [];
  tableHeaders.forEach((header) => {
    console.log("key", header);
    if (!updatedData.hasOwnProperty(header)) {
      alert("All fields are required");
      return;
    }
    record.push({
      column_name: header,
      column_value: updatedData[header],
    });
  });

  const body = {
    table_name: tableName,
    record_id: updatedData._id,
    record: record,
  };

  console.log("body", body);
  //submit form to /database-operator/update.php with data as table_name and record as the column name and value pairs
  const url = "/database-operator/update.php";
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        alert("Record updated successfully");
        //refresh the table data
        handleUpdateDeleteTableSelectChange(
          { target: { value: tableName } },
          "update"
        );
      } else {
        alert(data.message || "Record update failed");
      }
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
};

const populateUpdateTableStructure = (tableName, tableHeaders, tableData) => {
  const rowsContainer = document.querySelector("#update-records-rows");
  rowsContainer.innerHTML = ""; // Clear existing rows

  // Create Header Row
  const headerRow = document.createElement("div");
  headerRow.className = "grid gap-4 font-bold bg-gray-400/50 p-2 text-gray-950";
  headerRow.style.gridTemplateColumns = `${"1fr ".repeat(
    tableHeaders.length
  )} 0.5fr`; // last 0.5fr for Action column

  // Populate Header
  tableHeaders.forEach((header) => {
    const headerCell = document.createElement("div");
    headerCell.className = "text-center";
    headerCell.textContent = header.Field;
    headerRow.appendChild(headerCell);
  });
  // Add Action Column Header
  const actionHeader = document.createElement("div");
  actionHeader.className = "text-center";
  actionHeader.textContent = "Action";
  headerRow.appendChild(actionHeader);

  rowsContainer.appendChild(headerRow);

  // Loop through tableData to create rows
  tableData.forEach((rowData, rowIndex) => {
    // Create a form for each row
    const form = document.createElement("form");
    form.className = "grid gap-4 items-center p-2";
    form.style.gridTemplateColumns = `${"1fr ".repeat(
      tableHeaders.length
    )} 0.5fr`; // last 0.5fr for Action column

    form.onsubmit = (e) => {
      e.preventDefault();
      // Extract form data and submit to handleUpdateRecordSubmit
      const formData = new FormData(e.target);
      const updatedData = {};
      formData.forEach((value, key) => {
        updatedData[key] = value;
      });
      // Add _id to updatedData
      updatedData._id = rowData._id;
      console.log("record", updatedData);
      const tempHeaders = tableHeaders.map((header) => header.Field);
      handleUpdateRecordSubmit(tableName, tempHeaders, updatedData);
    };

    // Create input fields for each header
    tableHeaders.forEach((header) => {
      const inputDiv = document.createElement("div");
      const input = document.createElement("input");
      let inputType = "text";

      if (header.Type.includes("int")) {
        inputType = "number";
      } else if (header.Type.includes("date")) {
        inputType = "date";
      } else if (header.Type.includes("time")) {
        inputType = "time";
      }

      input.type = inputType;
      input.name = header.Field;
      input.id = `${header.Field}-${rowIndex}`;
      input.placeholder = `Enter ${header.Field}`;
      input.required = true;
      input.className = "text-sm p-2 border-b w-full bg-gray-300/40";
      input.value = rowData[header.Field] || ""; // Set initial value if available

      inputDiv.appendChild(input);
      form.appendChild(inputDiv);
    });

    // Create Action button
    const actionDiv = document.createElement("div");
    actionDiv.className = "text-center";
    const updateButton = document.createElement("button");
    updateButton.type = "submit";
    updateButton.className =
      "p-2 bg-blue-600 text-white rounded-xl cursor-pointer text-sm";
    updateButton.innerText = "Update";

    actionDiv.appendChild(updateButton);
    form.appendChild(actionDiv);

    // Append the form as a row
    rowsContainer.appendChild(form);
  });
};

// Delete tab content

const handleDeleteRecord = async (tableName, recordToDelete) => {
  //submit form to /database-operator/delete.php with data as table_name and record_id
  const url = "/database-operator/delete.php";
  const options = {
    method: "POST",
    body: JSON.stringify({
      table_name: tableName,
      record_id: recordToDelete,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        alert("Record deleted successfully");
        //refresh the table data
        handleUpdateDeleteTableSelectChange(
          { target: { value: tableName } },
          "delete"
        );
      } else {
        alert(data.message || "Record deletion failed");
      }
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
};

const populateDeleteTableStructure = (tableName, tableHeaders, tableData) => {
  const rowsContainer = document.querySelector("#delete-records-rows");
  rowsContainer.innerHTML = ""; // Clear existing rows

  // Create Header Row
  const headerRow = document.createElement("div");
  headerRow.className = "grid gap-4 font-bold bg-gray-400/50 p-2 text-gray-950";
  headerRow.style.gridTemplateColumns = `${"1fr ".repeat(
    tableHeaders.length
  )} 0.5fr`; // last 0.5fr for Action column

  // Populate Header
  tableHeaders.forEach((header) => {
    const headerCell = document.createElement("div");
    headerCell.className = "px-2";
    headerCell.textContent = header;
    headerRow.appendChild(headerCell);
  });
  // Add Action Column Header
  const actionHeader = document.createElement("div");
  actionHeader.className = "text-center";
  actionHeader.textContent = "Action";
  headerRow.appendChild(actionHeader);

  rowsContainer.appendChild(headerRow);

  // Loop through tableData to create rows
  tableData.forEach((rowData, rowIndex) => {
    // Create a form for each row
    const rowDiv = document.createElement("div");
    rowDiv.className = `grid gap-4 items-center p-2 ${
      rowIndex % 2 === 0 ? "bg-gray-300/40" : "bg-gray-300/80"
    }`;
    rowDiv.style.gridTemplateColumns = `${"1fr ".repeat(
      tableHeaders.length
    )} 0.5fr`; // Last 0.5fr for Action column

    // Create text fields for each header
    tableHeaders.forEach((header) => {
      const textDiv = document.createElement("div");
      textDiv.className = "text-sm p-2 w-full";
      textDiv.innerText = rowData[header] || "-"; // Display value or hyphen if not available

      rowDiv.appendChild(textDiv);
    });

    // Create Action button for Delete
    const actionDiv = document.createElement("div");
    actionDiv.className = "text-center";
    const deleteButton = document.createElement("button");
    deleteButton.className =
      "p-2 bg-red-600 text-white rounded-xl cursor-pointer text-sm";
    deleteButton.innerText = "Delete";

    // Handle Delete button click
    deleteButton.onclick = () => {
      const recordToDelete = rowData._id;
      console.log("Deleting record with _id:", recordToDelete);
      handleDeleteRecord(tableName, recordToDelete);
    };

    actionDiv.appendChild(deleteButton);
    rowDiv.appendChild(actionDiv);

    // Append the row
    rowsContainer.appendChild(rowDiv);
  });
};

//common function for both update and delete tab
const handleUpdateDeleteTableSelectChange = async (event, tab) => {
  const tableName = event.target.value;
  if (tableName === "") {
    return;
  }

  const tableData = await getTableData(tableName);

  if (tableData.length === 0) {
    alert("No data found in the table");
    return;
  }

  console.log("tableData: ", tableData);

  let tableHeaders = Object.keys(tableData[0]);
  //remove the id column from the table headers my checking if the column name is _id
  tableHeaders = tableHeaders.filter((header) => header !== "_id");

  //populate the table structure
  if (tab === "delete") {
    populateDeleteTableStructure(tableName, tableHeaders, tableData);
  } else if (tab === "update") {
    tableHeaders = await getTableStructure(tableName);
    console.log("tableHeaders from update: ", tableHeaders);
    populateUpdateTableStructure(tableName, tableHeaders, tableData);
  }
};
