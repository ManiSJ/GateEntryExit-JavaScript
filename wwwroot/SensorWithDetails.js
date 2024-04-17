baseUrl = 'http://localhost:5058';

sensor_getAllWithDetailsApiUrl = baseUrl + '/api/sensor/getAllWithDetails';
sensor_getAllWithDetailsApiUrlExcelReport = baseUrl + '/api/sensor/getAllWithDetailsExcelReport';
sensor_getAllWithDetailsApiUrlPdfReport = baseUrl + '/api/sensor/getAllWithDetailsPdfReport';

$(document).ready(function () {
    resetSensorWithDetailsForm();
    getAllSensorWithDetails();
})

function getAllSensorWithDetails(pageNumber = 1) {
    var maxResultCount = 5;
    var skipCount = (pageNumber - 1) * maxResultCount;
    $.ajax({
        type: "POST",
        url: sensor_getAllWithDetailsApiUrl,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            MaxResultCount: maxResultCount,
            SkipCount: skipCount,
            Sorting: '',
            GateIds: [],
            FromDate: null,
            ToDate: null
        }),
        dataType: "json",
        success: function (records) {
            populateSensorWithDetails(records);
            populateSensorWithDetailsPagination(records);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function populateSensorWithDetails(records) {
    var tableBody = $("#sensorWithDetials tbody");
    // Clear existing table rows
    tableBody.empty();

    $.each(records.items, function (index, record) {
        var row = $("<tr>")
            .append($("<td>").text(record.name))
            .append($("<td>").text(record.gateDetails.name))
            .append($("<td>").text(record.gateDetails.entryCount))
            .append($("<td>").text(record.gateDetails.exitCount));
        tableBody.append(row);
    });
}

function populateSensorWithDetailsPagination(records) {

    var pageSize = 5;
    var totalPages = Math.ceil(records.totalCount / pageSize);
    var pagination = $("#sensorWithDetialsPagination");
    // Clear existing pagination
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        var li = $("<li class='page-item'>")
            .append($("<a class='page-link'>").text(i));

        pagination.append(li);
    }

    $("#sensorWithDetialsPagination .page-link").click(function () {
        getAllSensorWithDetails($(this).text());
    })
}

function resetSensorWithDetailsForm() {

}

function filter() {

}
