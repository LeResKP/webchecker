# import the necessary packages
from skimage.measure import compare_ssim
import imutils
import cv2
import numpy as np


def compare_blobs(a_blob, b_blob):
    a_img = cv2.imdecode(np.fromstring(a_blob, dtype=np.uint8), 1)
    b_img = cv2.imdecode(np.fromstring(b_blob, dtype=np.uint8), 1)

    a_gray = cv2.cvtColor(a_img, cv2.COLOR_BGR2GRAY)
    b_gray = cv2.cvtColor(b_img, cv2.COLOR_BGR2GRAY)

    a_h, a_w = a_gray.shape
    b_h, b_w = b_gray.shape

    # Website pages should have the same size for comparison
    # We assume the width size is the same
    assert a_w == b_w

    # Ajust the height to have the same size
    if a_h < b_h:
        blank_image = np.zeros((b_h, b_w), np.uint8)
        blank_image[:a_h, :a_w] = a_gray
        a_gray = blank_image
    elif a_h > b_h:
        blank_image = np.zeros((a_h, a_w), np.uint8)
        blank_image[:b_h, :b_w] = b_gray
        b_gray = blank_image

    # Compare the gray images
    (score, diff) = compare_ssim(a_gray, b_gray, full=True)
    diff = (diff * 255).astype("uint8")

    thresh = cv2.threshold(diff, 0, 255,
                           cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    if not cnts:
        assert score == 1
        return None

    # Generate an image with only the diff between the 2 images
    max_w = max(a_w, b_w)
    max_h = max(a_h, b_h)
    diff_img = np.zeros((max_h, max_w, 4), np.uint8)

    for cnt in cnts:
        (x, y, w, h) = cv2.boundingRect(cnt)
        cv2.rectangle(diff_img, (x, y), (x + w, y + h), (0, 0, 255, 255), 2)

    return cv2.imencode('.png', diff_img)[1]
