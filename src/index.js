import $ from "jquery";

window.$ = $;
window.jQuery = $;

const getUrlVars = () => {
  const vars = {};
  const hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
  for (let i = 0; i < hashes.length; i++) {
    const hash = hashes[i].split("=");
    vars[hash[0]] = hash[1];
  }
  return vars;
};

$(function boot() {
  $(".link-container").hide();
  $(".btn-shorten").on("click", () => {
    const { organization, ship, secret } = getUrlVars();
    $.post({
      url: "/api/shorten",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: false,
      data: JSON.stringify({ url: $("#url-field").val(), ship, organization, secret }),
      success(data) {
        $("#link").val(data.shortUrl);
        $(".link-container").hide().fadeIn("slow");
      }
    });
  });
});
