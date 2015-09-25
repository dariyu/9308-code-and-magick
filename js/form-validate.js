var restoreValueFromCoockies = function(form) {
    var element;

    for (var i = 0; i < formReview.elements.length; i++) {
        element = formReview.elements[i];

        if (docCookies.hasItem(element.name)) {
            element.value = docCookies.getItem(element.name);
        }
    }
};

var formReview = document.forms[1];
var formReviewName = formReview['review-name'];
var formReviewText = formReview['review-text'];

restoreValueFromCoockies(formReview);

formReviewName.addEventListener('change', function(evt) {
    if (formReviewName) {
        document.all[83].innerHTML = '';
    }
});

formReviewText.addEventListener('change', function(evt) {
    if (formReviewText) {
        document.all[84].innerHTML = '';
    }
});

formReview.addEventListener('submit', function(evt) {
    evt.preventDefault();

    docCookies.setItem(formReviewName.name, formReviewName.value);

    var element;
    for (var i = 0; i < formReview.elements['review-mark'].length; i++) {
        element = formReview.elements['review-mark'][i];

        docCookies.setItem(element.name, element.value);
    }

    formReview.submit();
});
