baseUrl = 'http://localhost:5058';

gateEntry_createApiUrl = baseUrl + '/api/gateEntry/create';
gateEntry_updateApiUrl = baseUrl + '/api/gateEntry/edit';
gateEntry_deleteApiUrl = baseUrl + '/api/gateEntry/delete';
gateEntry_getByIdApiUrl = baseUrl + '/api/gateEntry/getById';
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
        getGateEntry(id);
    });

    $(".gateEntry-delete").click(function () {
        var id = $(this).data("id");
        deleteGateEntry(id);
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
    var id = $("#entryId").val();
    var date = $("#entryDate").val();
    var hour = $("#entryHour").val();
    var minute = $("#entryMinute").val();
    var numberOfPeople = $("#entryNumberOfPeople").val();
    var gateId = $("#entryGateId").val();
    var timeStamp = date + 'T' + hour + ':' + minute + ':00';
    if (id) {
        editGateEntry(id, numberOfPeople, timeStamp);
    }
    else {
        createGateEntry(gateId, numberOfPeople, timeStamp);
    }
}

function createGateEntry(gateId, numberOfPeople, timeStamp) {
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
            $("#entryId").val(res.id);
            var dateComponents = res.timeStamp.split('T')[0];
            var timeComponents = res.timeStamp.split('T')[1].split(':');
            $("#entryDate").val(dateComponents);
            $("#entryHour").val(timeComponents[0]);
            $("#entryMinute").val(timeComponents[1]);
            $("#entryNumberOfPeople").val(res.numberOfPeople);
            $("#entryGateId").val(res.gateId);
            $("#entryGateName").val(res.gateName);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function editGateEntry(id, numberOfPeople, timeStamp) {
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
    $("#entryId").val('');
    $("#entryDate").val('');
    $("#entryHour").val('');
    $("#entryMinute").val('');
    $("#entryNumberOfPeople").val('');
    $("#entryGateId").val('');
    $("#entryGateName").val('');
}