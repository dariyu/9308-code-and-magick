var formReview = document.forms[1];
var formReviewName = formReview['review-name'];
var formReviewText = formReview['review-text'];

formReviewName.addEventListener('change', function() {
    if (formReviewName) {
        document.all[83].innerHTML = '';
    }
});

formReviewText.addEventListener('change', function() {
    if (formReviewText) {
        document.all[84].innerHTML = '';
    }
});
