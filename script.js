document.addEventListener("DOMContentLoaded", () => {
  const openFormButton = document.getElementById("openFormButton");
  const closeFormButton = document.getElementById("closeFormButton");
  const feedbackPopup = document.getElementById("feedbackPopup");
  const feedbackForm = document.getElementById("feedbackForm");
  const messageContainer = document.getElementById("messageContainer");

  openFormButton.addEventListener("click", () => {
    feedbackPopup.style.display = "flex";
    history.pushState({ formOpen: true }, "", "#feedback-form");
    loadFormData();
  });

  closeFormButton.addEventListener("click", () => {
    feedbackPopup.style.display = "none";
    history.back();
  });

  window.addEventListener("popstate", (event) => {
    if (!event.state || !event.state.formOpen) {
      feedbackPopup.style.display = "none";
    }
  });

  feedbackForm.addEventListener("input", () => {
    const formData = new FormData(feedbackForm);
    const formDataObject = Object.fromEntries(formData.entries());
    localStorage.setItem("feedbackFormData", JSON.stringify(formDataObject));
  });

  function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem("feedbackFormData"));
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        const input = feedbackForm.elements[key];
        if (input) input.value = savedData[key];
      });
    }
  }

  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(feedbackForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formcarry.com/s/LA-DEo4yZys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        messageContainer.textContent = "Форма успешно отправлена!";
        messageContainer.classList.remove("error");
        localStorage.removeItem("feedbackFormData");
        feedbackForm.reset();
      } else {
        throw new Error("Ошибка при отправке формы");
      }
    } catch (error) {
      messageContainer.textContent = "Ошибка при отправке формы. Попробуйте еще раз.";
      messageContainer.classList.add("error");
    }
  });
});
