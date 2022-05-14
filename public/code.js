ability_name = ""
ability_info = ""
result = ""
searched_pokemons = []
searched_type = ""
current_page = 1
total_pages = 0
min_weight = 0
max_weight = 0
search_history = []
current_tab = "home-page"

function confirm_timeline_update(data) {
    console.log(data)
}

function insert_or_update_event(data) {
    console.log("Full data", data)
    // console.log("Event Data", data[0][0].event)
    if (data[0].length > 0) {
        $.ajax(
            {
                "url": `/updateEvent`,
                "type": "POST",
                "data": {
                    "event": `${data[0][0].event}`
                },
                "success": confirm_timeline_update
            }
        )
    }
    else {
        current_timestamp = get_current_timestamp()
        $.ajax(
            {
                "url": `/insertEvent`,
                "type": "POST",
                "data": {
                    "event": `${data[1]}`,
                    "times": 1,
                    "date": current_timestamp
                }
            }
        )
    }
}

function get_current_timestamp() {
    var date = new Date()
    return date.toUTCString()
}

function captialize(some_string) {
    return some_string[0].toUpperCase() + some_string.slice(1)
}

function change_type_background(type_name) {
    return `<span class='${type_name}'>${type_name.toUpperCase()}</span>`
}

function project_only_name(data) {
    return data.name
}

function project_search_name(data) {
    return data.name
}

function get_all_pokemons(data) {
    searched_pokemons.push(data)
}

function get_color(type) {
    if (type == "normal") {
        return "#aa9"
    }
    if (type == "ice") {
        return "#6cf"
    }
    if (type == "psychic") {
        return "#f59"
    }
    if (type == "fire") {
        return "#f42"
    }
    if (type == "fighting") {
        return "#b54"
    }
    if (type == "bug") {
        return "#ab2"
    }
    if (type == "dark") {
        return "#754"
    }
    if (type == "water") {
        return "#39f"
    }
    if (type == "poison") {
        return "#a59"
    }
    if (type == "rock") {
        return "#ba6"
    }
    if (type == "steel") {
        return "#aab"
    }
    if (type == "electric") {
        return "#fc3"
    }
    if (type == "ground") {
        return "#db5"
    }
    if (type == "ghost") {
        return "#66b"
    }
    if (type == "fairy") {
        return "#e9e"
    }
    if (type == "grass") {
        return "#7c5"
    }
    if (type == "flying") {
        return "#89f"
    }
    if (type == "dragon") {
        return "#76e"
    }
}

function apply_background_gradient_full_info(data) {
    if (data.types.length == 2) {
        $(`.pokemons .pokemon_full`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0].type.name)}, ${get_color(data.types[1].type.name)})`)
    }else {
        $(`.pokemons .pokemon_full`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0].type.name)}, rgb(228, 228, 228))`)
    }
}

function apply_background_gradient(data) {
    if (data.types.length == 2) {
        $(`.pokemons #${data.name}`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0])}, ${get_color(data.types[1])})`)
    }else {
        $(`.pokemons #${data.name}`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0])}, rgb(228, 228, 228))`)
    }
}

function remove_page_buttons() {
    this_page = $(this).attr("id") + "-page"
    $(`#${this_page} #page_buttons`).html("")
}

async function remove_from_timeline() {
    await $.ajax(
        {
            "url": "/removeThisEvent",
            "type": "DELETE",
            "data": {
                "event": `${$(this).attr("id")}`
            }
        }
    )
    load_timeline()
}

async function clear_timeline() {
    await $.ajax(
        {
            "url": "/removeAllEvents",
            "type": "DELETE"
        }
    )
    load_timeline()
}

function remove_from_history() {
    search_history.splice($(this).attr("id"), 1)
    $(this).parent().remove()
}

function clear_history() {
    search_history.length = 0
    $("#displayed-history").html("")
}

function view_search_result() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    $(".pokemons").html("")
    searched_pokemons = []
    history_item = $(this).parent().attr("id")
    history_item = history_item.split(",")
    for (i = 0; i < history_item.length; i++) {
        searched_pokemons.push(history_item[i])
    }
    console.log(searched_pokemons)
    display_current_page_pokemons()
}

function filter_by_low_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i]
    }
    if (base_stat_total < 300) {
        return data
    }
}

function filter_by_moderate_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i]
    }
    if (base_stat_total < 550 && base_stat_total >= 300) {
        return data
    }
}

function filter_by_high_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i]
    }
    if (base_stat_total >= 550) {
        return data
    }
}

async function get_pokemon_by_determined_base_stat_range() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    searched_pokemons = []
    // for (i = 1; i < 890; i++) {
    //     await $.ajax(
    //         {
    //             "url": `https://pokeapi.co/api/v2/pokemon/${i}`,
    //             "type": "GET",
    //             "success": get_all_pokemons
    //         }
    //     )   
    // }
    await $.ajax(
        {
            "url": "/findAllPokemons",
            "type": "GET",
            "success": function(data) {
                for (i = 0; i < data.length; i++) {
                   get_all_pokemons(data[i])
                }
            }
        }
    )
    console.log(searched_pokemons)
    if ($("#high_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_high_stats)
        searched_pokemons = searched_pokemons.map(project_only_name)
        search_history.push([searched_pokemons, `Searched by high base stat total`])
        await $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by high base stat total.`
                },
                "success": insert_or_update_event
            }
        )
    }
    if ($("#moderate_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_moderate_stats)
        searched_pokemons = searched_pokemons.map(project_only_name)
        search_history.push([searched_pokemons, `Searched by moderate base stat total`])
        await $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by moderate base stat total.`
                },
                "success": insert_or_update_event
            }
        )
    }
    if ($("#low_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_low_stats)
        searched_pokemons = searched_pokemons.map(project_only_name)
        search_history.push([searched_pokemons, `Searched by low base stat total`])
        await $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by low base stat total.`
                },
                "success": insert_or_update_event
            }
        )
    }
    console.log(searched_pokemons)
    display_current_page_pokemons()
}

function filter_selected_weight_range(data) {
    if ((data.weight / 10 >= min_weight) && (data.weight / 10 <= max_weight)) {
        return data
    }
}

async function search_pokemon_by_weight() {
    searched_pokemons = []
    console.log(min_weight, max_weight)
    if (parseInt(min_weight) < parseInt(max_weight)) {
        await $.ajax(
            {
                "url": "/findPokemonByWeightRange",
                "type": "POST",
                "data": {
                    "min_weight": min_weight,
                    "max_weight": max_weight
                },
                "success": function(data) {
                    console.log(data)
                    searched_pokemons = data.map(project_only_name)
                },
            }
        )
        $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by weight range: ${min_weight}kg - ${max_weight}kg.`
                },
                "success": insert_or_update_event
            }
        )
        // searched_pokemons = searched_pokemons.filter(filter_selected_weight_range)
        // searched_pokemons = searched_pokemons.map(project_only_name)
        console.log(searched_pokemons)
        search_history.push([searched_pokemons, `Searched by weight range: ${min_weight}kg - ${max_weight}kg`])
        display_current_page_pokemons()
        
    }
}

function get_pokemon_by_weight() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    min_weight = parseInt($("#min-weight").val())
    max_weight = parseInt($("#max-weight").val()) 
    if ($("#min-weight").val().length > 0 && $("#max-weight").val().length > 0) {
        if ((parseInt($("#min-weight").val()) >= 0) && (parseInt($("#max-weight").val()) >= 0)) {
            search_pokemon_by_weight()
        }
    }
}

function get_current_page() {
    console.log(current_tab)
    $(`#${current_tab} #page_buttons button`).removeClass("active")
    current_page = $(this).val()
    display_current_page_pokemons()
}

function get_first_prev_next_last() {
    if ($(this).attr("id") == "first") {
        current_page = 1
        display_current_page_pokemons()
    }
    if ($(this).attr("id") == "prev") {
        current_page -= 1
        if (current_page < 1) {
            current_page = 1
        }
        display_current_page_pokemons()
    }
    if ($(this).attr("id") == "next") {
        current_page += 1
        if (current_page > total_pages) {
            current_page = total_pages
        }
        display_current_page_pokemons()
    }
    if ($(this).attr("id") == "last") {
        current_page = total_pages
        display_current_page_pokemons()
    }
}

function display_page_buttons(total_pages) {
    console.log(total_pages)
    console.log("page button called")
    $(`#${current_tab} #page_buttons`).html("")
    buttons = ""
    buttons += `<button id='first'>First</button> `
    buttons += `<button id='prev'>Prev</button>`
    for (i = 1; i < total_pages + 1; i++) {
        // buttons += `<span class='page_button'>`
        buttons += `<button class='page_number_button' value='${i}' id ='${i}'>${i}</button>`
        // buttons += `</span>`
    }
    buttons += `<button id='next'>Next</button> `
    buttons += `<button id='last'>Last</button>`
    old = $("#page_buttons").html()
    $(`#${current_tab} #page_buttons`).html(buttons)
}

function display_current_page_pokemons() {
    $(".pokemons").html("")
    if (searched_pokemons.length > 12) {
        page_size = 12
        total_pages = Math.ceil(searched_pokemons.length / 12)
        start = current_page * (current_page - 1)
        end = current_page * (current_page - 1) + page_size
        display_page_buttons(total_pages)
        $(`#${current_tab} #page_buttons button#${current_page}`).addClass("active")
        for (start; start < end; start++) {
            $.ajax(
                {
                    "url": "/findPokemonByName",
                    // "url": `https://pokeapi.co/api/v2/pokemon/${searched_pokemons[start]}`,
                    "type": "POST",
                    "data": {
                        "name": searched_pokemons[start]
                    },
                    "success": display_random_pokemons
                }
            )
        }
    }else {
        for (start = 0; start < searched_pokemons.length; start++) {
            $.ajax(
                {
                    "url": "/findPokemonByName",
                    // "url": `https://pokeapi.co/api/v2/pokemon/${searched_pokemons[start]}`,
                    "type": "POST",
                    "data": {
                        "name": searched_pokemons[start]
                    },
                    "success": display_random_pokemons
                }
            )
        }
    }
}

function get_pokemon_basic_info(data) {
    console.log(data)
    searched_pokemons = []
    for (i = 0; i < data.length; i++) {
        searched_pokemons.push(data[i].name)
    }
    search_data = data.map(project_search_name)
    search_history.push([search_data, `Searched by ${searched_type} type pokemons`])
    display_current_page_pokemons()
    $(`#${current_tab} #page_buttons button#1`).addClass("active")
}

async function get_pokemon_by_type() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    $(".pokemons").html("")
    searched_type = $("#type_dropdown option:selected").val()
    console.log(searched_type)
    await $.ajax(
        {
            "url": `/findPokemonByType`,
            // "url": `https://pokeapi.co/api/v2/type/${searched_type}`,
            "type": "POST",
            "data": {
                "type": searched_type
            },
            "success": get_pokemon_basic_info
        }
    )
    $.ajax(
        {
            "url": "/findEvent",
            "type": "POST",
            "data": {
                "event": `User searched ${searched_type} pokemons.`
            },
            "success": insert_or_update_event
        }
    )
}

async function get_pokemon_by_name() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    $(".pokemons").html("")
    searched_name = $("#name").val()
    search_history.push([searched_name, `Searched by name: ${searched_name.toLowerCase()}`])
    console.log(search_history)
    await $.ajax(
        {
            "url": `/findPokemonByName`,
            // "url": `https://pokeapi.co/api/v2/pokemon/${searched_name}`,
            "type": "POST",
            "data": {
                "name": searched_name
            },
            "success": display_random_pokemons 
        }
    )
    $.ajax(
        {
            "url": "/findEvent",
            "type": "POST",
            "data": {
                "event": `User searched pokemons by name, ${searched_name}.`
            },
            "success": insert_or_update_event
        }
    )
}

function hide_pokemons() {
    $(".pokemons").html("")
}

function display_history() {
    $("#displayed-history").empty()
    for (i = 0; i < search_history.length; i++) {
        console.log(search_history[i])
        old = $("#displayed-history").html()
        result = ""
        result += `<div class="history-item" id="${search_history[i][0]}"><button class="show-result" id="${i}">${i}: ${search_history[i][1]}</button><button class="remove">Remove</button></div>`
        $("#displayed-history").html(old + result)
    }
}

function view_page() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    current_tab = ($(this).attr("id") + "-page")
    $(".pokemons").html("")
    tab = $(this).attr("id")
    $(".page-tab").removeClass("active")
    $(".tab-stuff").hide()
    $(`#${tab}`).addClass("active")
    $(`#${tab}-page`).show()
}

function get_english_version(data) {
    if (data.language.name == "en") {
        return data
    }
}

function get_english_ability_info(data) {
    // $(".ability-content").css("height", "0vh")
    ability_info = data.effect_entries.filter(get_english_version)
    // if ($(`#abilities div#${ability_name}`).text() == "") {
    //     $(".ability-content").text("")
        // $(`#abilities div#${ability_name}`).css({"height":"10vh", "overflow":"auto"})
    // }
    // else {
    //     $(`#abilities div#${ability_name}`).text("")
    // }
}

function view_ability_detail() {
    console.log("abiltes")
    for (i = 0; i < ability_name.length; i++) {
        $.ajax(
            {
                "url": `https://pokeapi.co/api/v2/ability/${ability_name}`,
                "type": "GET",
                "success": get_english_ability_info    
            }
        )
    }
}

function view_abilities() {
    $(".tablinks").removeClass("active")
    $(".tabcontent").hide()
    $("#abilities").show()
    $("#abilities-tab").addClass("active")
}

function view_desc() {
    $(".tablinks").removeClass("active")
    $(".tabcontent").hide() // hide all content of each tab
    $("#desc").addClass("active")
    $("#description").show() // show the clicked tab's content
}

function view_base_stats() {
    $(".tablinks").removeClass("active")
    $(".tabcontent").hide()
    $("#base_stats").addClass("active")
    $("#base-stats").show()

}

async function display_this_pokemon(data) {
    $(".pokemons").css("grid-template-columns", "auto")
    $(".pokemons").empty()
    old = $(".pokemons").html()
    result = ""
    result += `<div class='pokemon_full'>`
    result += `<div>`
    result += `<h3>${captialize(data.name)}</h3>`
    result += `<img src='${data.sprites.other["official-artwork"].front_default}'><br>`
    for (i = 0; i < data.types.length; i++) {
        result += change_type_background(data.types[i].type.name)
    }
    result += `</div>`
    result += `<div class='tabs'>`
    result += `<div class="tab-container">`
    result += `<button class="tablinks active" id="base_stats">Base Stats</button>`
    result += `<button class="tablinks" id="desc">Desc</button>`
    result += `<button class="tablinks" id="abilities-tab">Abilities</button>`
    result += `</div>`
    result += `<div id="base-stats" class="tabcontent"'>
                    <label for="hp">HP   ${data.stats[0].base_stat}</label>
                    <progress class="hp" value="${data.stats[0].base_stat}" max="255"></progress>
                    <label for="attack">Atk   ${data.stats[1].base_stat}</label>
                    <progress class="attack" value="${data.stats[1].base_stat}" max="255"></progress>
                    <label for="defense">Def   ${data.stats[2].base_stat}</label>
                    <progress class="defense" value="${data.stats[2].base_stat}" max="255"></progress>
                    <label for="special_attack">Sp. Atk   ${data.stats[3].base_stat}</label>
                    <progress class="special_attack" value="${data.stats[3].base_stat}" max="255"></progress>
                    <label for="special_defense">Sp. Def   ${data.stats[4].base_stat}</label>
                    <progress class="special_defense" value="${data.stats[4].base_stat}" max="255"></progress>
                    <label for="speed">Spd   ${data.stats[5].base_stat}</label>
                    <progress class="speed" value="${data.stats[5].base_stat}" max="255"></progress>
               </div>`
    result += `<div id="description" class="tabcontent">
                    <div style='text-align:right;'>
                        <p>Height</p>
                        <p>Weight</p>
                        <p>Base Exp</p>
                    </div>
                    <div style='text-align:right;'>
                        <p>${(data.height) / 10}m</p>
                        <p>${(data.weight) / 10}kg</p>
                        <p>${data.base_experience}</p>
                    </div>
               </div>`
    result += `<div id="abilities" class="tabcontent">`
    for (i = 0; i < data.abilities.length; i++) {
        ability_name = data.abilities[i].ability.name
        console.log(`ability name: ${ability_name}`)
        console.log(captialize(data.abilities[i].ability.name))
        result += `<div class='ability' id='${data.abilities[i].ability.name}'>${captialize(data.abilities[i].ability.name)}</div>`
        await $.ajax(
            {
                url: `https://pokeapi.co/api/v2/ability/${ability_name}`,
                type: "GET",
                success: get_english_ability_info
            }
        )
        result += `<div id="${ability_name}" class="ability-content">${ability_info[0].short_effect}</div>`
    }
    result += `</div>`
    result += `</div>`
    $(`#${current_tab} .pokemons`).html(old + result)
    apply_background_gradient_full_info(data)
    $(".tabcontent").hide()
    $("#base-stats").show()
}

async function get_this_pokemon_info() {
    $(`#${current_tab} #page_buttons`).html("")
    console.log($(this).attr("id"))
    await $.ajax({
        "url": `https://pokeapi.co/api/v2/pokemon/${$(this).attr("id")}`,
        "type": "GET",
        "success": display_this_pokemon
    })
    $.ajax(
        {
            "url": "/findEvent",
            "type": "POST",
            "data": {
                "event": `User viewed full detail of ${$(this).attr("id")}.`
            },
            "success": insert_or_update_event
        }
    )
}

function display_random_pokemons(data) {
    console.log(data)
    old = $(".pokemons").html()
    result = ""
    result += `<div class='pokemon' id='${data.name}'>`
    result += `<p>${captialize(data.name)}</p>`
    result += `<img src='${data.official_artwork}'>`
    result += "<p>"
    for (i = 0; i < data.types.length; i++) {
        result += change_type_background(data.types[i])
    }
    result += "</p>"
    result += "</div>"
    $(".pokemons").html(old + result)
    apply_background_gradient(data)
}

function loop_through_pokemon_db(data) {
    console.log(data)
    for (q = 0; q < 12; q++) {
        console.log(Math.floor(Math.random() * data.length))
        display_random_pokemons(data[Math.floor(Math.random() * data.length)])
    }
}

function get_random_pokemons() {
    $(".pokemons").empty()
    // for (i = 0; i < 12; i++) {
    //     $.ajax({
    //         "url": `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 898) + 1}`,
    //         "type": "GET",
    //         "success": display_random_pokemons
    //     })
    // }
    $.ajax(
        {
            "url": "/findAllPokemons",
            "type": "GET",
            "success": loop_through_pokemon_db
        }
    )
}

function display_timeline(data) {
    console.log("Timeline Data", data)
    $("#displayed-timeline").html("")
    for (i = 0; i < data.length; i++){
        result = ``
        result += `<div class="timeline-item" id="${data[i].event}">`
        result += `<div>`
        result += `<p class="timeline-date">${data[i].date}</p>`
        result += `<hr>`
        result += `<p class="timeline-event">${data[i].event}</p>`
        result += `<p class="timeline-hits">Times: ${data[i].times}</p>`
        result += `</div>`
        result += `<button class="timeline-remove" id="${data[i].event}">Remove</button>`
        result += `</div>`
        // 
        old = $("#displayed-timeline").html()
        $("#displayed-timeline").html(old + result)
    }
}

function load_timeline() {
    $.ajax(
        {
            "url": `/timeline`,
            "type": "GET",
            "success": display_timeline
        }
    )
}

function load_home_page() {
    $(".tab-stuff").hide()
    $("#home-page").show()
}

function setup() {
    get_random_pokemons()
    load_home_page()
    load_timeline()
    $("body").on("click", ".pokemon", get_this_pokemon_info)
    $("body").on("click", "#base_stats", view_base_stats)
    $("body").on("click", "#desc", view_desc)
    $("body").on("click", "#abilities-tab", view_abilities)
    $(".page-tabs button").click(view_page)
    $("#history").click(display_history)
    $("#home").click(get_random_pokemons)
    $("#search").click(hide_pokemons)
    $("#find_by_name").click(get_pokemon_by_name)
    $("#find_by_type").click(get_pokemon_by_type)
    $("body").on("click", "#page_buttons button", get_first_prev_next_last)
    $("body").on("click", ".page_number_button", get_current_page)
    $("#find_by_weight").click(get_pokemon_by_weight)
    $("#find_by_stats").click(get_pokemon_by_determined_base_stat_range)
    $("body").on("click", ".history-item button.show-result", view_search_result)
    $("body").on("click", "#history", remove_page_buttons)
    $("body").on("click", "#search", remove_page_buttons)
    $("#clear-history").click(clear_history)
    $("body").on("click", ".remove", remove_from_history)
    $("#clear-timeline").click(clear_timeline)
    $("body").on("click", ".timeline-remove", remove_from_timeline)
    $("#timeline").click(load_timeline)
}

$(document).ready(setup)