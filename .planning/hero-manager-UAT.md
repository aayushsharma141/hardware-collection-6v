# Hero Manager UAT

## Test Case 1: Hero Manager in Studio Sidebar
- **Goal:** Verify that the "Hero Manager" document is accessible in the Sanity Studio left sidebar.
- **Status:** Passed
- **Notes:** Verified autonomously via browser. The "Hero Manager" icon and item appear under the "Showroom" section.

## Test Case 2: Hero Manager Structure
- **Goal:** Verify that clicking "Hero Manager" opens a singleton document containing "Home Page Hero" and "Collection Hero" array fields.
- **Status:** Passed
- **Notes:** Verified autonomously via browser. Document opens correctly with both arrays.

## Test Case 3: Adding Hero Slides
- **Goal:** Verify that clicking "Add item" to either array correctly allows the selection of "Hero Slide".
- **Status:** Passed
- **Notes:** Verified autonomously via browser. Clicking "Add item" successfully adds a Hero Slide.

## Test Case 4: Hero Slide Dynamic Fields
- **Goal:** Verify that changing the "Slide Type" (Promotional Banner, Collection, Brand, Offer, Custom Hero) dynamically shows and hides the appropriate fields.
- **Status:** Passed
- **Notes:** Verified autonomously via browser. Choosing "Offer" displays the "Select Offer" dropdown accurately.

## Test Case 5: Offer Schema Cleanup
- **Goal:** Verify that the "Also show in the hero carousel of" (`heroPlacement`) and "Hero order" (`heroOrder`) fields are successfully removed from the individual Offer schema.
- **Status:** Passed
- **Notes:** Verified autonomously via browser. Older fields are no longer present in the Offer schema.
