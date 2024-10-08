export class FirebaseErrorInterceptor {
  static handle(error, text = null) {
    let errorMessage = "Ocorreu um erro.";

    switch (error.code) {
      case "auth/invalid-credential":
        errorMessage = "Credencial inválida. Por favor, verifique suas credenciais.";
        break;
      case "auth/wrong-password":
        errorMessage = "Senha atual incorreta.";
        break;
      case "auth/email-already-in-use":
        errorMessage = "O novo email já está em uso por outra conta.";
        break;
      case "auth/weak-password":
        errorMessage = "A nova senha é muito fraca. Por favor, escolha uma senha mais segura.";
        break;
      default:
        errorMessage = error.message;
    }
    console.error(error)
    console.error(text || "Erro Firebase:", errorMessage);
    return errorMessage;
  }
}
