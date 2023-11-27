var doWorkload = false;

function createWorkload(weight, tick) {
	if (doWorkload) {
		console.log("create workload " + weight + "/" + tick);
		setTimeout(function () {
			createWorkload(weight, tick)
		}, tick);
		$.ajax({
			type: "GET",
			url: "/was/workload/" + weight,
			success : function(data) {
				console.log("workload [" + data.weight + "] during " + data.dur);
			},
			error : function(res, status, error) {
				console.log("workload error");
			}
		});
	}
}

function startWorkload() {
	var weight = Number($('#workload-weight')[0].value);
	var tick = Number($('#workload-tick')[0].value);
	doWorkload = true;
	createWorkload(weight, tick);
	$('#workload-action').html(`
<button class="c-button" onclick="stopWorkload();">정지</button>
	`);
}

function stopWorkload() {
	doWorkload = false;
	$('#workload-action').html(`
<button class="c-button" onclick="startWorkload();">시작</button>
	`)
}

function createMessage(record) {
	var text = record[0].value;
	if (text === undefined || text == null || text == "") {
		window.alert("값을 입력해야 합니다.");
	} else {
		$.ajax({
			type: "POST",
			url: "/was/messages",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify({
				text: text
			}),
			success : function(data) {
				readMessages();
			},
			error : function(res, status, error) {
				$("#main").html('<h3><p align="center">알려지지 않은 오류 입니다</p></h3>');
			}
		});
	}
};

function readMessages() {
	$.ajax({
		type: "GET",
		url: "/was/messages",
		success : function(data) {
			var t = `
<h3>
	<p align="center">메세지</p>
</h3>
<p align="center"><input id="create-message" type="text" value=""></p>
<p align="center"><button class="c-button" onclick="createMessage($('#create-message'));">메세지 추가</button></p>
<br/>
<p align="center"><button class="c-button" onclick="readMessages();">메세지 목록 갱신</button></p>

<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>메세지</th>
			<th>기능</th>
		</tr>
	<tbody>
`;
			for (var i = 0, record; record = data[i]; i++) {
				t += `
<tr id="` + record.id + `">
	<td>` + record.id + `</td>
	<td class="record-text"><input type="text" value="` + record.text + `"></input></td>
	<td>
		<table width="20%">
			<tr>
				<td>
					<button class="c-button" onclick="updateMessage($('#` + record.id + `'));">수정</button>
				</td>
				<td>
					<button class="c-button" onclick="deleteMessage($('#` + record.id + `'));">삭제</button>
				</td>
			</tr>
		</table>
	</td>
</tr>
`
			}
			t += `
</table>
`
			
			$("#main").html(t);
		},
		error : function(res, status, error) {
			$("#main").html('<h3><p align="center">알려지지 않은 오류 입니다</p></h3>');
		}
	});
};

function updateMessage(record) {
	var id = record.attr("id");
	var text = record.children(".record-text").children("input")[0].value;
	if (text === undefined || text == null || text == "") {
		window.alert("값을 입력해야 합니다.");
	} else {
		$.ajax({
			type: "PUT",
			url: "/was/messages/" + id,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify({
				text: text
			}),
			success : function(data) {
				readMessages();
			},
			error : function(res, status, error) {
				$("#main").html('<h3><p align="center">알려지지 않은 오류 입니다</p></h3>');
			}
		});
	}
};

function deleteMessage(record) {
	var id = record.attr("id");
	$.ajax({
		type: "DELETE",
		url: "/was/messages/" + id,
		success : function(data) {
			readMessages();
		},
		error : function(res, status, error) {
			$("#main").html('<h3><p align="center">알려지지 않은 오류 입니다</p></h3>');
		}
	});
};

$(document).ready(function() {
	readMessages();
});