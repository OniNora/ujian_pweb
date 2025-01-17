<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "perpus");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT * FROM rental_buku";
        $result = $conn->query($sql);
        $records = array();
        
        while($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
        echo json_encode($records);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'));
        $sql = "INSERT INTO rental_buku (nama_peminjam, judul_buku, tanggal_meminjam, tanggal_dikembalikan) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $data->nama_peminjam, $data->judul_buku, $data->tanggal_meminjam, $data->tanggal_dikembalikan);
        
        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE rental_buku SET nama_peminjam=?, judul_buku=?, tanggal_meminjam=?, tanggal_dikembalikan=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssi", $data->nama_peminjam, $data->judul_buku, $data->tanggal_meminjam, $data->tanggal_dikembalikan, $data->id);
        
        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'));
        $sql = "DELETE FROM rental_buku WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $data->id);
        
        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
}

$conn->close();
?>
