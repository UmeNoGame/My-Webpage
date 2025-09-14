<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "garo-roga@live.fr"; // ton mail réel
    $subject = $_POST['subject'];
    $message =
        "Nom et prenom: " . $_POST['fullname'] . "\r\n" .
        "Adresse mail: " . $_POST['email'] . "\r\n" .
        "Sujet: " . $_POST['subject'] . "\r\n" .
        "\r\n" .
        "Message: " . $_POST['message'];

    $from = $_POST['email'];
    $headers = "From: $from\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo "Message envoyé avec succès !";
    } else {
        echo "Erreur lors de l'envoi du message.";
    }
}
?>