<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Operator</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
</head>

<body>
    <main class="w-full h-full bg-zinc-300 flex flex-col items-center justify-center">
        <div class="container relative w-3/4 h-3/4 bg-white rounded-3xl shadow-md p-2 flex flex-col">
            <div class="tabs w-full flex text-whit bg-gray-100 rounded-2xl rounded-br-none rounded-bl-none">
                <div id="create-tab" data-target="create-tab-content"
                    class="tab active-tab text-zinc-900 p-2 cursor-pointer min-w-24 flex justify-center items-center">
                    Create</div>
                <div id="insert-tab" data-target="insert-tab-content"
                    class="tab text-zinc-900 p-2 cursor-pointer min-w-24 flex justify-center items-center">
                    Insert</div>
                <div id="update-tab" data-target="update-tab-content"
                    class="tab text-zinc-900 p-2 cursor-pointer min-w-24 flex justify-center items-center">
                    Update</div>
                <div id="delete-tab" data-target="delete-tab-content"
                    class="tab text-zinc-900 p-2 cursor-pointer min-w-24 flex justify-center items-center">
                    Delete</div>
            </div>
            <div id="create-tab-content"
                class="tab-content active-tab-content hidden w-full flex-1 bg-gray-200 rounded-2xl rounded-tl-none rounded-tr-none p-3 flex-col gap-3 overflow-y-auto">
                <h2 class="text-xl font-semibold">Create a New Table</h2>
                <form action="./create-table.php" method="post" onsubmit="handleCreateTableSubmit(event)"
                    class="flex flex-col gap-2 h-full">
                    <div class="input-box flex gap-3 items-center">
                        <label for="table-name" class="font-semibold">Table Name</label>
                        <input type="text" name="table-name" id="table-name" placeholder="Enter the table name" required
                            class="p-2 rounded-xl border">
                    </div>
                    <hr class="text-gray-400">
                    <div id="table-columns-input-fields" class="columns flex flex-col gap-2">
                        <div id="create-table-column-field-1" class="column-input flex gap-10 items-center">
                            <div>
                                <label for="column-name-1" class="font-semibold">Column Name</label>
                                <input type="text" name="column-name-1" id="column-name-1"
                                    placeholder="Enter the column name" required class="p-2 rounded-xl border">
                            </div>
                            <div>
                                <label for="column-datatype-1" class="font-semibold">Column Datatype</label>
                                <select name="column-datatype-1" id="column-datatype-1" required
                                    class="p-2 rounded-xl border cursor-pointer">
                                    <option value="INT">INT</option>
                                    <option value="VARCHAR">VARCHAR</option>
                                    <option value="TEXT">TEXT</option>
                                    <option value="DATE">DATE</option>
                                    <option value="TIME">TIME</option>
                                    <option value="CHAR">CHAR</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="add-column-field-btn">
                        <button type="button" onclick="addColumnField()"
                            class="p-2 bg-zinc-900 text-white rounded-xl text-sm mt-3 cursor-pointer">
                            Add Column Field
                        </button>
                    </div>
                    <div class="create-table-form-submit-btn absolute bottom-4 right-4">
                        <button type="submit" class="p-3 px-5  bg-blue-600 text-white rounded-xl mt-3 cursor-pointer">
                            Create Table
                        </button>
                    </div>
                </form>
            </div>
            <div id="insert-tab-content"
                class="tab-content hidden w-full flex-1 bg-gray-200 rounded-2xl rounded-tl-none rounded-tr-none p-3 flex-col gap-3 overflow-y-auto">
                <h2 class="text-xl font-semibold">Insert Record in Table</h2>
                <form action="./insert.php" method="post" onsubmit="handleInsertRecordSubmit(event)"
                    class="flex flex-col gap-2 h-full">
                    <div class="input-box flex gap-3 items-center">
                        <label for="table-name">
                            Choose Table to Insert Record
                        </label>
                        <select name="table-name-select" id="insert-table-name-select" required
                            class="table-name-select p-2 rounded-xl border cursor-pointer" onchange="handleTableSelectChange(event)">
                            >
                            <!-- Options will be added here dynamically -->
                        </select>
                    </div>
                    <hr class="text-gray-400">
                    <div id="insert-record-input-fields" class="columns grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <!-- Columns will be added here dynamically -->
                    </div>
                    <div class="create-table-form-submit-btn absolute bottom-4 right-4">
                        <button type="submit" class="p-3 px-5  bg-blue-600 text-white rounded-xl mt-3 cursor-pointer">
                            Insert Record
                        </button>
                    </div>
                </form>
            </div>
            <div id="update-tab-content"
                class="tab-content hidden w-full flex-1 bg-gray-200 rounded-2xl rounded-tl-none rounded-tr-none p-3 flex-col gap-3 overflow-y-auto">
                <h2 class="text-xl font-semibold">Update Record from Table</h2>
                <form action="./insert.php" method="post" onsubmit="handleInsertRecordSubmit(event)"
                    class="flex flex-col gap-2 h-full">
                    <div class="input-box flex gap-3 items-center">
                        <label for="table-name">
                            Choose Table to Insert Record
                        </label>
                        <select name="table-name-select" id="update-table-name-select" required
                            class="table-name-select p-2 rounded-xl border cursor-pointer" onchange="handleUpdateTableSelectChange(event)">
                            >
                            <!-- Options will be added here dynamically -->
                        </select>
                    </div>
                    <hr class="text-gray-400">
                    <div id="insert-record-input-fields" class="columns grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <!-- Columns will be added here dynamically -->
                    </div>
                    <div class="create-table-form-submit-btn absolute bottom-4 right-4">
                        <button type="submit" class="p-3 px-5  bg-blue-600 text-white rounded-xl mt-3 cursor-pointer">
                            Insert Record
                        </button>
                    </div>
                </form>
            </div>
            <div id="delete-tab-content"
                class="tab-content hidden w-full flex-1 bg-gray-200 rounded-2xl rounded-tl-none rounded-tr-none">Delete
            </div>
        </div>
    </main>

    <script src="script.js"></script>
</body>

</html>