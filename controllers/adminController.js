const page = async (req,res) => {
    res.status(200).render("admin/homePage");
}

module.exports = {
    page
}