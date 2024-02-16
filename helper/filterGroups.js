// add filtering helper by majore
export const filterMajore = function (majore) {
    console.log(majore);
    // 6
    if (majore === "physical therapy") return 6;
    // 5
    if (majore === "dentist" || majore === "pharmacy" || majore === "engineering") return 5;
    // 4
    if (majore === "computer science" || majore === "business" || majore === "media") return 4;
};
