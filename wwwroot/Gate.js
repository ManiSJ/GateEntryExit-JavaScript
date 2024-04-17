var baseUrl = 'http://localhost:5058';

var createApiUrl = baseUrl + '/api/gate/create';
var updateApiUrl = baseUrl + '/api/gate/edit';
var deleteApiUrl = baseUrl + '/api/gate/delete';
var getByIdApiUrl = baseUrl + '/api/gate/getById';
var getAllApiUrl = baseUrl + '/api/gate/getAll';
var getAllByIdApiUrl = baseUrl + '/api/gate/getAllById';

$(document).ready(function () {
    getAllGates();
})

function getAllGates(pageNumber = 1) {
    var maxResultCount = 5;
    var skipCount = (pageNumber - 1) * maxResultCount;
    $.ajax({
        type: "POST",
        url: getAllApiUrl,
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
        getAllGates($(this).text());
    })
}

function submitGateForm() {
    var id = $("#gateId").val();
    var name = $("#gateName").val();
    if (gateId) {
        editGate(id, name);
    }
    else {
        createGate(name);
    }
}

function createGate(name){
    $.ajax({
        type: "POST",
        url: createApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8", 
        data: JSON.stringify({ Name : name}),
        success: function (res) {
            $("#gateName").val('');
            getAllGates();
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
        url: getByIdApiUrl + '/' + id, 
        dataType: "json",
        success: function (res) {
            $("#gateId").val(res.id);
            $("#gateName").val(res.name);
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
        url: updateApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8", 
        data: JSON.stringify({ Id : id, Name : name}),
        success: function (res) {
            $("#gateId").val('');
            $("#gateName").val('');
            getAllGates();
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
        url: deleteApiUrl + '/' + id,
        success: function (res) {
            getAllGates();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}