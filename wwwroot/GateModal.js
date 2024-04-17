
baseUrl = 'http://localhost:5058';

sensor_getAllGateApiUrl = baseUrl + '/api/gate/getAll';

selectedGateIds = [];
selectedGateNames = [];

function getAllModalGate(isSingleSelect, forSensor, forGateEntry, forGateExit, pageNumber = 1) {
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
            populateGatesInModal(isSingleSelect, forSensor, forGateEntry, forGateExit, records);
        },
        error: function (xhr, textStatus, error) {
            console.log("Xhr status code:", xhr.status);
            console.log("Xhr status text:", xhr.statusText);
            console.log("Text status:", textStatus);
            console.log("Error:", error);
        }
    })
}

function populateGatesInModal(isSingleSelect, forSensor, forGateEntry, forGateExit, records) {
    var modalBody = $("#gate-modal .modal-body");
    var gates = '';

    var selectedGateId = '';
    var selectedGateIds = ''
    var selectedGateIdsArray = [];

    if (isSingleSelect == true) {
        if (forSensor == true) {
            selectedGateId = $("#sensorGateId").val();
        }
        else if (forGateEntry == true) {
            selectedGateId = $("#entryGateId").val();
        }
        else if (forGateExit == true) {
            selectedGateId = $("#exitGateId").val();
        }
    }
    else {
        selectedGateIds = $("#selectedGateIds").val();
        selectedGateIdsArray = selectedGateIds.split(',');
    }

    $.each(records.items, function (index, record) {
        if (isSingleSelect == true) {
            var rowHtml = `<tr><td>
                    <input type='radio' name='gate' class='form-check-input' ` + (selectedGateId == record.id ? 'checked' : '') + ` onclick='gateSingleSelection(` + forSensor + ',' + forGateEntry + ',' + forGateExit + ',' + JSON.stringify(record) + `)' />
                </td>
                <td>` + record.name + `</td></tr>`;
            gates += rowHtml;
        }
        else {
            var isChecked = selectedGateIdsArray.includes(record.id);
            var rowHtml = `<tr><td>
                    <input type='checkbox' name='gate' class='form-check-input' ` + (isChecked ? 'checked' : '') + ` onclick='gateMultipleSelection(event, `  + JSON.stringify(record) + `)' />
                </td>
                <td>` + record.name + `</td></tr>`;
            gates += rowHtml;
        }
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
        getAllModalGate(isSingleSelect, forSensor, forGateEntry, forGateExit, pageNumber);
    })
}

function openGateModal(isSingleSelect, forSensor, forGateEntry, forGateExit) {
    selectedGateIds = [];
    selectedGateNames = [];
    $("#selectedGateIds").val(selectedGateIds);
    $("#selectedGateNames").val(selectedGateNames);
    $("#gate-modal").modal('show');
    getAllModalGate(isSingleSelect, forSensor, forGateEntry, forGateExit)
}

function gateSingleSelection(forSensor, forGateEntry, forGateExit, record) {
    if (forSensor == true) {
        $("#sensorGateId").val(record.id);
        $("#sensorGateName").val(record.name);
    }
    else if (forGateEntry == true){
        $("#entryGateId").val(record.id);
        $("#entryGateName").val(record.name);
    }
    else if (forGateExit == true) {
        $("#exitGateId").val(record.id);
        $("#exitGateName").val(record.name);
    }
    $("#gate-modal").modal('hide');
}

function gateMultipleSelection(event, record) {
    if (event.target.checked == true) {
        selectedGateIds.push(record.id);
        selectedGateNames.push(record.name);
        $("#selectedGateIds").val(selectedGateIds);
        $("#selectedGateNames").html(`<p>Selected gate names - ` + selectedGateNames.join(', ') + `</p>`);
    }
    else {
        selectedGateIds.pop(record.id);
        selectedGateNames.pop(record.name);
        $("#selectedGateIds").val(selectedGateIds);
        $("#selectedGateNames").html(`<p>Selected gate names - ` + selectedGateNames.join(', ') + `</p>`);
    }
}