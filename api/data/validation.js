module.exports = {
    // checks if a supplied string is a valid string
    async validateString(str) {
        if (arguments.length !== 1) return false;
        if (typeof str !== 'string' || !str.trim()) return false;
        return true;
    },

    // checks if an email is good with regex stuff
    async isGoodEmail(email) {
        if (arguments.length !== 1) return false;
        if (typeof email !== 'string' || !email.trim()) return false;

        //https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    validateGameEid(eid) {
        let intEid = Number.parseInt(eid);
        if ((!isNaN(eid) && !Number.isInteger(intEid)) || eid < 0)
            throw 'Game endpoint id must be an integer greater than or equal to 0.';
        return intEid;
    },

    validatePosInt(i) {
        if (!i) return false;
        let parsed = Number.parseInt(i);
        return !isNaN(i) && Number.isInteger(parsed) && parsed > 0;
    },

    validateNonNegInt(i) {
        if (!i) return false;
        let parsed = Number.parseInt(i);
        return !isNaN(i) && Number.isInteger(parsed) && parsed >= 0;
    },

    validateRating(r) {
        return (
            !isNaN(r) || !Number.isInteger(rating) || rating < 0 || rating > 10
        );
    },
};
