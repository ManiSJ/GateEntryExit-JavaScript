baseUrl = 'http://localhost:5058';

gateExit_createApiUrl = baseUrl + '/api/gateExit/create';
gateExit_updateApiUrl = baseUrl + '/api/gateExit/edit';
gateExit_deleteApiUrl = baseUrl + '/api/gateExit/delete';
gateExit_getByIdApiUrl = baseUrl + '/api/gateExit/getById';
gateExit_getAllApiUrl = baseUrl + '/api/gateExit/getAll';

$(document).ready(function () {
    resetGateExitForm();
    getAllGateExit();
})
function getAllGateExit(pageNumber = 1) {
    var maxResultCount = 5;
    var skipCount = (pageNumber - 1) * maxResultCount;
    $.ajax({
        type: "POST",
        url: gateExit_getAllApiUrl,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            MaxResultCount: maxResultCount,
            SkipCount: skipCount,
            Sorting: ''
        }),
        dataType: "json",
        success: function (records) {
            populateGateExits(records);
            populateGateExitsPagination(records);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function populateGateExits(records) {
    var tableBody = $("#gateExits tbody");
    // Clear existing table rows
    tableBody.empty();

    $.each(records.items, function (index, record) {
        var row = $("<tr>")
            .append($("<td>")
                .html("<button class='GateExit-edit btn btn-primary' data-id='" + record.id + "'>Edit</button>" +
                    "<button class='GateExit-delete mx-2 btn btn-danger'data-id='" + record.id + "'>Delete</button>"))
            .append($("<td>").text(record.gateName))
            .append($("<td>").text(record.numberOfPeople))
            .append($("<td>").text(record.timeStamp));
        tableBody.append(row);
    });

    $(".GateExit-edit").click(function () {
        var id = $(this).data("id");
        getGateExit(id);
    });

    $(".GateExit-delete").click(function () {
        var id = $(this).data("id");
        deleteGateExit(id);
    });
}

function populateGateExitsPagination(records) {

    var pageSize = 5;
    var totalPages = Math.ceil(records.totalCount / pageSize);
    var pagination = $("#gateExitsPagination");
    // Clear existing pagination
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        var li = $("<li class='page-item'>")
            .append($("<a class='page-link'>").text(i));

        pagination.append(li);
    }

    $("#gateExitsPagination .page-link").click(function () {
        getAllGateExit($(this).text());
    })
}

function submitGateExitForm() {
    var id = $("#exitId").val();
    var date = $("#exitDate").val();
    var hour = $("#exitHour").val();
    var minute = $("#exitMinute").val();
    var numberOfPeople = $("#exitNumberOfPeople").val();
    var gateId = $("#exitGateId").val();
    var timeStamp = date + 'T' + hour + ':' + minute + ':00';
    if (id) {
        editGateExit(id, numberOfPeople, timeStamp);
    }
    else {
        createGateExit(gateId, numberOfPeople, timeStamp);
    }
}

function createGateExit(gateId, numberOfPeople, timeStamp) {
    $.ajax({
        type: "POST",
        url: gateExit_createApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ NumberOfPeople: numberOfPeople, TimeStamp: timeStamp, GateId: gateId }),
        success: function (res) {
            resetGateExitForm();
            getAllGateExit();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function getGateExit(id) {
    $.ajax({
        type: "POST",
        url: gateExit_getByIdApiUrl + '/' + id,
        dataType: "json",
        success: function (res) {
            $("#exitId").val(res.id);
            var dateComponents = res.timeStamp.split('T')[0];
            var timeComponents = res.timeStamp.split('T')[1].split(':');
            $("#exitDate").val(dateComponents);
            $("#exitHour").val(timeComponents[0]);
            $("#exitMinute").val(timeComponents[1]);
            $("#exitNumberOfPeople").val(res.numberOfPeople);
            $("#exitGateId").val(res.gateId);
            $("#exitGateName").val(res.gateName);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function editGateExit(id, numberOfPeople, timeStamp) {
    $.ajax({
        type: "POST",
        url: gateExit_updateApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ Id: id, NumberOfPeople: numberOfPeople, TimeStamp: timeStamp }),
        success: function (res) {
            resetGateExitForm();
            getAllGateExit();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function deleteGateExit(id) {
    $.ajax({
        type: "DELETE",
        url: gateExit_deleteApiUrl + '/' + id,
        success: function (res) {
            getAllGateExit();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function resetGateExitForm() {
    $("#exitId").val('');
    $("#exitDate").val('');
    $("#exitHour").val('');
    $("#exitMinute").val('');
    $("#exitNumberOfPeople").val('');
    $("#exitGateId").val('');
    $("#exitGateName").val('');
}