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

const handleTableSelectChange = (event) => {
  const tableName = event.target.value;
  if (tableName === "") {
    return;
  }

  //fetch the table structure from /database-operator/get-table-structures.php
  fetch(
    "/database-operator/get-table-structures.php?table_name=" +
      tableName
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        populateTableStructure(data.data);
      } else {
        alert(data.message || "Failed to fetch table structure");
      }
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
      console.log("time");
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
                        <button type="button" onclick="deleteColumnField('create-table-column-field-${columnFieldColumnCount}')"
                            class="w-6 h-6 flex items-center justify-center text-white bg-red-500 text-2xl rounded-full text-sm cursor-pointer">
                            X
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
      } else {
        alert(data.message || "Record insertion failed");
      }
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
};

const handleUpdateTableSelectChange = (event) => {
  const tableName = event.target.value;
  if (tableName === "") {
    return;
  }

  //fetch the table data from /database-operator/get-table-data.php
  fetch(
    "/database-operator/get-table-data.php?table_name=" +
      tableName
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        // populateUpdateTableData(data.data);
      } else {
        alert(data.message || "Failed to fetch table data");
      }
    });
};
