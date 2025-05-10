<?php
// Konekcija s bazom
$conn = new mysqli("localhost", "root", "root", "apoteka2");

if ($conn->connect_error) {
    die("Greška pri konekciji: " . $conn->connect_error);
}

$ime = $_POST['ime'];
$email = $_POST['email'];
$poruka = $_POST['poruka'];

$sql = "INSERT INTO kontakt (ime, email, poruka) VALUES ('$ime', '$email', '$poruka')";

if ($conn->query($sql) === TRUE) {
    header("Location: poruka_uspjesna.html");
    exit();
} else {
    echo "Greška: " . $sql . "<br>" . $conn->error;
}


$conn->close();
?>
