baseUrl = 'http://localhost:5058';

gateEntry_createApiUrl = baseUrl + '/api/gateEntry/create';
gateEntry_updateApiUrl = baseUrl + '/api/gateEntry/edit';
gateEntry_deleteApiUrl = baseUrl + '/api/gateEntry/delete';
gateEntry_getApiUrl = '';
gateEntry_getAllApiUrl = baseUrl + '/api/gateEntry/getAll';

$(document).ready(function () {
    resetGateEntryForm();
    getAllGateEntry();
})

function getAllGateEntry(pageNumber = 1) {
    var maxResultCount = 5;
    var skipCount = (pageNumber - 1) * maxResultCount;
    $.ajax({
        type: "POST",
        url: gateEntry_getAllApiUrl,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            MaxResultCount: maxResultCount,
            SkipCount: skipCount,
            Sorting: ''
        }),
        dataType: "json",
        success: function (records) {
            populateGateEntries(records);
            populateGateEntriesPagination(records);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function populateGateEntries(records) {
    var tableBody = $("#gateEntries tbody");
    // Clear existing table rows
    tableBody.empty();

    $.each(records.items, function (index, record) {
        var row = $("<tr>")
            .append($("<td>")
                .html("<button class='gateEntry-edit btn btn-primary' data-id='" + record.id + "'>Edit</button>" +
                    "<button class='gateEntry-delete mx-2 btn btn-danger'data-id='" + record.id + "'>Delete</button>"))
            .append($("<td>").text(record.gateName))
            .append($("<td>").text(record.numberOfPeople))
            .append($("<td>").text(record.timeStamp));
        tableBody.append(row);
    });

    $(".gateEntry-edit").click(function () {
        var id = $(this).data("id");
        getGate(id);
    });

    $(".gateEntry-delete").click(function () {
        var id = $(this).data("id");
        deleteGate(id);
    });
}

function populateGateEntriesPagination(records) {

    var pageSize = 5;
    var totalPages = Math.ceil(records.totalCount / pageSize);
    var pagination = $("#gateEntriesPagination");
    // Clear existing pagination
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        var li = $("<li class='page-item'>")
            .append($("<a class='page-link'>").text(i));

        pagination.append(li);
    }

    $("#gateEntriesPagination .page-link").click(function () {
        getAllGateEntry($(this).text());
    })
}

function submitGateEntryForm() {
    var id = $("#entryGateId").val();
    var name = $("#entryGateName").val();
    if (id) {
        editGateEntry(id, name);
    }
    else {
        createGateEntry(name);
    }
}

function createGateEntry(name) {
    $.ajax({
        type: "POST",
        url: gateEntry_createApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ NumberOfPeople: numberOfPeople, TimeStamp: timeStamp, GateId : gateId }),
        success: function (res) {
            resetGateEntryForm();
            getAllGateEntry();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function getGateEntry(id) {
    $.ajax({
        type: "POST",
        url: gateEntry_getByIdApiUrl + '/' + id,
        dataType: "json",
        success: function (res) {
            
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function editGateEntry(id, name) {
    $.ajax({
        type: "POST",
        url: gateEntry_updateApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ Id: id, NumberOfPeople: numberOfPeople, TimeStamp: timeStamp }),
        success: function (res) {
            resetGateEntryForm();
            getAllGateEntry();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function deleteGateEntry(id) {
    $.ajax({
        type: "DELETE",
        url: gateEntry_deleteApiUrl + '/' + id,
        success: function (res) {
            getAllGateEntry();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function resetGateEntryForm() {
    $("#entryGateId").val('');
    $("#entryGateName").val('');
}