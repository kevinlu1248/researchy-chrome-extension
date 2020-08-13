function MessageHandler() {
	this.handleMessage = (researchyAction, request, sender, sendResponse) => {
		// console.log(this[researchyAction]);
		if (typeof this[researchyAction] == "function") {
			return this[researchyAction](request, sender, sendResponse);
		} else {
			return "Sorry, it looks like the researchyAction does not match any of the implemented actions.";
		}
	};
}
