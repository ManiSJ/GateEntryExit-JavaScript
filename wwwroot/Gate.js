baseUrl = 'http://localhost:5058';

gate_createApiUrl = baseUrl + '/api/gate/create';
gate_updateApiUrl = baseUrl + '/api/gate/edit';
gate_deleteApiUrl = baseUrl + '/api/gate/delete';
gate_getByIdApiUrl = baseUrl + '/api/gate/getById';
gate_getAllApiUrl = baseUrl + '/api/gate/getAll';
gate_getAllByIdApiUrl = baseUrl + '/api/gate/getAllById';

$(document).ready(function () {
    getAllGate();
})

function getAllGate(pageNumber = 1) {
    var maxResultCount = 5;
    var skipCount = (pageNumber - 1) * maxResultCount;
    $.ajax({
        type: "POST",
        url: gate_getAllApiUrl,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            MaxResultCount: maxResultCount,
            SkipCount: skipCount,
            Sorting: ''
        }),
        dataType: "json",
        success: function (records) {
            populateGates(records);
            populateGatesPagination(records);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function populateGates(records) {
        var tableBody = $("#gates tbody");
        // Clear existing table rows
        tableBody.empty();

    $.each(records.items, function (index, record) {
            var row = $("<tr>")
                .append($("<td>")
                    .html("<button class='gate-edit btn btn-primary' data-id='" + record.id + "'>Edit</button>" +
                        "<button class='gate-delete mx-2 btn btn-danger'data-id='" + record.id + "'>Delete</button>"))
                .append($("<td>").text(record.name));
            // Add more table cells as needed
            tableBody.append(row);
    });
    
    $(".gate-edit").click(function () {
        var id = $(this).data("id");
        getGate(id);
    });

    $(".gate-delete").click(function () {
        var id = $(this).data("id");
        deleteGate(id);
    });
}

function populateGatesPagination(records) {

    var pageSize = 5;
    var totalPages = Math.ceil(records.totalCount / pageSize);
    var pagination = $("#gatesPagination");
    // Clear existing pagination
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        var li = $("<li class='page-item'>")
            .append($("<a class='page-link'>").text(i));

        pagination.append(li);
    }

    $("#gatesPagination .page-link").click(function () {
        getAllGate($(this).text());
    })
}

function submitGateForm() {
    var id = $("#gateId").val();
    var name = $("#gateName").val();
    if (id) {
        editGate(id, name);
    }
    else {
        createGate(name);
    }
}

function createGate(name){
    $.ajax({
        type: "POST",
        url: gate_createApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8", 
        data: JSON.stringify({ Name : name}),
        success: function (res) {
            resetForm();
            getAllGate();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function getGate(id) {
    $.ajax({
        type: "POST",
        url: gate_getByIdApiUrl + '/' + id, 
        dataType: "json",
        success: function (res) {
            resetForm();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function editGate(id, name) {
    $.ajax({
        type: "POST",
        url: gate_updateApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8", 
        data: JSON.stringify({ Id : id, Name : name}),
        success: function (res) {
            $("#gateId").val('');
            $("#gateName").val('');
            getAllGate();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function deleteGate(id) {
    $.ajax({
        type: "DELETE",
        url: gate_deleteApiUrl + '/' + id,
        success: function (res) {
            getAllGate();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function resetForm() {
    $("#gateId").val(res.id);
    $("#gateName").val(res.name);
}