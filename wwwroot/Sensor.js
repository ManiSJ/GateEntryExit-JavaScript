baseUrl = 'http://localhost:5058';

sensor_createApiUrl = baseUrl + '/api/sensor/create';
sensor_updateApiUrl = baseUrl + '/api/sensor/edit';
sensor_deleteApiUrl = baseUrl + '/api/sensor/delete';
sensor_getByIdApiUrl = baseUrl + '/api/sensor/getById';
sensor_getAllApiUrl = baseUrl + '/api/sensor/getAll';
sensor_getAllWithDetailsApiUrl = baseUrl + '/api/sensor/getAllWithDetails';
sensor_getAllWithDetailsApiUrlExcelReport = baseUrl + '/api/sensor/getAllWithDetailsExcelReport';
sensor_getAllWithDetailsApiUrlPdfReport = baseUrl + '/api/sensor/getAllWithDetailsPdfReport';
sensor_getAllGateApiUrl = baseUrl + '/api/gate/getAll';

$(document).ready(function () {
    getAllSensor();
})

function getAllSensor(pageNumber = 1) {
    var maxResultCount = 5;
    var skipCount = (pageNumber - 1) * maxResultCount;
    $.ajax({
        type: "POST",
        url: sensor_getAllApiUrl,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            MaxResultCount: maxResultCount,
            SkipCount: skipCount,
            Sorting: ''
        }),
        dataType: "json",
        success: function (records) {
            populateSensors(records);
            populateSensorsPagination(records);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function populateSensors(records) {
    var tableBody = $("#sensors tbody");
    // Clear existing table rows
    tableBody.empty();

    $.each(records.items, function (index, record) {
        var row = $("<tr>")
            .append($("<td>")
                .html("<button class='sensor-edit btn btn-primary' data-id='" + record.id + "'>Edit</button>" +
                    "<button class='sensor-delete mx-2 btn btn-danger'data-id='" + record.id + "'>Delete</button>"))
            .append($("<td>").text(record.name))
            .append($("<td>").text(record.gateDetails.name));
        // Add more table cells as needed
        tableBody.append(row);
    });

    $(".sensor-edit").click(function () {
        var id = $(this).data("id");
        getSensor(id);
    });

    $(".sensor-delete").click(function () {
        var id = $(this).data("id");
        deleteSensor(id);
    });
}

function populateSensorsPagination(records) {

    var pageSize = 5;
    var totalPages = Math.ceil(records.totalCount / pageSize);
    var pagination = $("#sensorsPagination");
    // Clear existing pagination
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        var li = $("<li class='page-item'>")
            .append($("<a class='page-link'>").text(i));

        pagination.append(li);
    }

    $("#sensorsPagination .page-link").click(function () {
        getAllSensor($(this).text());
    })
}

function submitSensorForm() {
    var id = $("#sensorId").val();
    var name = $("#sensorName").val();
    var gateId = $("#sensorGateId").val();
    if (id) {
        editSensor(id, name);
    }
    else {
        createSensor(name, gateId);
    }
}

function createSensor(name, gateId) {
    $.ajax({
        type: "POST",
        url: sensor_createApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ Name: name, GateId: gateId }),
        success: function (res) {
            resetSensorForm();
            getAllSensor();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function getSensor(id) {
    $.ajax({
        type: "POST",
        url: sensor_getByIdApiUrl + '/' + id,
        dataType: "json",
        success: function (res) {
            $("#sensorId").val(res.id);
            $("#sensorName").val(res.name);
            $("#sensorGateId").val(res.gateDetails.id);
            $("#sensorGateName").val(res.gateDetails.name);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function editSensor(id, name) {
    $.ajax({
        type: "POST",
        url: sensor_updateApiUrl,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ Id: id, Name: name }),
        success: function (res) {
            resetSensorForm();
            getAllSensor();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function deleteSensor(id) {
    $.ajax({
        type: "DELETE",
        url: sensor_deleteApiUrl + '/' + id,
        success: function (res) {
            getAllSensor();
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function getAllModalGate(callback, pageNumber = 1) {
    var maxResultCount = 5;
    var skipCount = (pageNumber - 1) * maxResultCount;
    $.ajax({
        type: "POST",
        url: sensor_getAllGateApiUrl,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            MaxResultCount: maxResultCount,
            SkipCount: skipCount,
            Sorting: ''
        }),
        dataType: "json",
        success: function (records) {
            populateGatesInModal(records);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}


function populateGatesInModal(records) {
    var modalBody = $("#gate-modal .modal-body");
    var gates = '';
    var selectedGateId = $("#sensorGateId").val();
    $.each(records.items, function (index, record) {
        var rowHtml = `<tr><td>
                    <input type='radio' name='gate' class='form-check-input' ` + (selectedGateId == record.id ? 'checked' : '') + ` onclick='gateSingleSelection(` + JSON.stringify(record) + `)' />
                </td>
                <td>` + record.name + `</td></tr>`;
        gates += rowHtml;
    });

    var modalPagination = '';
    var pageSize = 5;
    var totalPages = Math.ceil(records.totalCount / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        var pageItem = `<li class='page-item'><a class='page-link' data-pagenumber='` + i + `'>` + i + `</a></li>`;
        modalPagination += pageItem;
    }

    modalBody.html(`<table class='table table-striped'>
        <thead>
        <tr>
        <th>Action</th>
        <th>Name</th>
        </tr>
        </thead>
        <tbody>` + gates +
        `</tbody></table>
        <nav class="float-end">
        <ul id="sensorsPagination" class="pagination">` + modalPagination +
        `</ul>
        </nav>`);

    $("#gate-modal .modal-body .page-link").click(function () {
        var pageNumber = $(this).data("pagenumber");
        getAllModalGate(populateGatesInModal, pageNumber);
    })
}

function openGateModal() {
    $("#gate-modal").modal('show');
    getAllModalGate(populateGatesInModal)
}

function gateSingleSelection(record) {
    $("#sensorGateId").val(record.id);
    $("#sensorGateName").val(record.name);
    $("#gate-modal").modal('hide');
}

function resetSensorForm() {
    $("#sensorId").val('');
    $("#sensorName").val('');
    $("#sensorGateId").val('');
    $("#sensorGateName").val('');
}