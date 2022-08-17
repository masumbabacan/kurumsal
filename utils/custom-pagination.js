const pagination = (limit,total,page) => {
    var perpage = (limit == null) ? 5 : limit;
    var total = total;
    var pages = Math.ceil(total / perpage);
    var pageNumber = (page == null) ? 1 : page;
    var startFrom = (pageNumber - 1) * perpage;
    return {
        startFrom,
        perpage,
        pages,
        total,
    }
}

module.exports = pagination;