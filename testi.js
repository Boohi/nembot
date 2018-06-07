jQuery(document).ready(function() {
    if(document.getElementsByClassName("breadcrumbs").length === 0) {
        return 0;
    }
    var language = document.getElementsByClassName("breadcrumbs")[0].getElementsByTagName("li")[0].getElementsByTagName("a")[0].innerHTML;
    var ul = document.getElementsByClassName("hidding-timings");
    if(ul.length === 0) {
        return 0;
    }
    var days = ul[0].getElementsByTagName("li");
    var ajat = document.getElementsByClassName("today-timing");
    var paiva;
    var sunday = '<img class="icon icons8-todayTime" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADCElEQVR4nO1awY0qMQxNCZRACZRAB0sHTAfQAXTC3iI/H1LC0gF0AB0wHfx/CSvwJCwzsWGQ8qRckLCdF9uxM3auoqKioqKiosIQIYQJM38x8wbADxGdAPy7XfG3H2beMPNXCGHybruLEEKYENESwEFutsc6ENHyo8jw3k/jSV8KNi7XhZk33vvpu/f3EAYb7xABYPXufXbgvZ8+4ep7ItoS0QLATMoAMCOiBRFtAez/Co3ReEPcUO7Uz8y8HmJsDKU1gHPOG4hoYbCl5wGgyRjXAmiU9bQZXWp6hhjVMYiIvi2ydrxVvkdBQnT7IkPkf3v8L0f8a8IhJjwZ8y0zz/vIGUqAc84x8zwREpeXJMZUtu+7+ShnMAHO/ZLQuR36yumFeEWpxF8pAVFGJxyYeT1E1p9IuT4RfQ+Vp0GAc84lEuPFpHROnH5bokiLgBDCROYDItoOlfdIiUx8TYlMLQKiLBkKul6QUHBWkKlGQJQnK8amVOat8LvMr5FotAmIZbP+jRDd/85YjftWm4CYpO9kqoRBwv33xUKdPgHOOUdER5EMy6tDmf21MqwRAfq2QvTmWjW3EQGyR9lrCD0JoZ3HjCGwIADATBzWSUOouqEpuc+ul9tbCagEVAJkiamSBC0gkyAUSnaza9ACVtegSSFkARNbTVg1AkTTpuKtVs2QNsyaIee6TYbZu1sBZDtMREc14RAdoUqJqYxEyd6oCU+9u6kqKIQ8IBS+VyaReBS1eX3tidR7pclNFZOM9IKduqKeALAzP/0rND+MaCDh+vYJWt4IUencVGnajs4HWtXMn0MmFC6vJCEzlNG+rD7R+Dw+FCm3f0uPkjMEwM5qQCKR8N6bhx6QcCGipZaeOG+Ym0NqtPQMNW6RyAm/FSOA1dAhKQCr1FTpNeZH05p776ep20Gsw3UMFpkxuZtx2ocjd0R0HGNDdm1IctNcGqsdYyN2hzjNtVUmoiWi7RhK76cRs3bzRGg8dHUAzUdtPIXoFbdjsKnpzzNuxmk/ftMVFRUVFRUVo8d/fHG1F7o+XcIAAAAASUVORK5CYII=" alt="todayTime"> Sunday';
    var saturday = '<img class="icon icons8-todayTime" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADCElEQVR4nO1awY0qMQxNCZRACZRAB0sHTAfQAXTC3iI/H1LC0gF0AB0wHfx/CSvwJCwzsWGQ8qRckLCdF9uxM3auoqKioqKiosIQIYQJM38x8wbADxGdAPy7XfG3H2beMPNXCGHybruLEEKYENESwEFutsc6ENHyo8jw3k/jSV8KNi7XhZk33vvpu/f3EAYb7xABYPXufXbgvZ8+4ep7ItoS0QLATMoAMCOiBRFtAez/Co3ReEPcUO7Uz8y8HmJsDKU1gHPOG4hoYbCl5wGgyRjXAmiU9bQZXWp6hhjVMYiIvi2ydrxVvkdBQnT7IkPkf3v8L0f8a8IhJjwZ8y0zz/vIGUqAc84x8zwREpeXJMZUtu+7+ShnMAHO/ZLQuR36yumFeEWpxF8pAVFGJxyYeT1E1p9IuT4RfQ+Vp0GAc84lEuPFpHROnH5bokiLgBDCROYDItoOlfdIiUx8TYlMLQKiLBkKul6QUHBWkKlGQJQnK8amVOat8LvMr5FotAmIZbP+jRDd/85YjftWm4CYpO9kqoRBwv33xUKdPgHOOUdER5EMy6tDmf21MqwRAfq2QvTmWjW3EQGyR9lrCD0JoZ3HjCGwIADATBzWSUOouqEpuc+ul9tbCagEVAJkiamSBC0gkyAUSnaza9ACVtegSSFkARNbTVg1AkTTpuKtVs2QNsyaIee6TYbZu1sBZDtMREc14RAdoUqJqYxEyd6oCU+9u6kqKIQ8IBS+VyaReBS1eX3tidR7pclNFZOM9IKduqKeALAzP/0rND+MaCDh+vYJWt4IUencVGnajs4HWtXMn0MmFC6vJCEzlNG+rD7R+Dw+FCm3f0uPkjMEwM5qQCKR8N6bhx6QcCGipZaeOG+Ym0NqtPQMNW6RyAm/FSOA1dAhKQCr1FTpNeZH05p776ep20Gsw3UMFpkxuZtx2ocjd0R0HGNDdm1IctNcGqsdYyN2hzjNtVUmoiWi7RhK76cRs3bzRGg8dHUAzUdtPIXoFbdjsKnpzzNuxmk/ftMVFRUVFRUVo8d/fHG1F7o+XcIAAAAASUVORK5CYII=" alt="todayTime"> Saturday';
    
    if(!ajat.length === 0) {
        paiva = ajat[0].getElementsByTagName("strong")[0];
        if(language == "Etusivu") {
            if(paiva.innerHTML == sunday) {
                paiva.innerHTML = "Sunnuntai";
            }
            if(paiva.innerHTML == saturday) {
                paiva.innerHTML = "Lauantai";
            }
        }
        if(language == "Hem") {
            if(paiva.innerHTML == sunday) {
                paiva.innerHTML = "Söndag";
            }
            if(paiva.innerHTML == saturday) {
                paiva.innerHTML = "Lördag";
            }
        }
    }
    if(language == "Etusivu") {
        for(var i = 0; i<days.length; i++) {
            switch(days[i].getElementsByTagName("strong")[0].innerHTML) {
                case "Monday":
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Maanantai";
                    break;
                case 'Tuesday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Tiistai";
                    break;
                case 'Wednesday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Keskiviikko";
                    break;
                case 'Thursday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Torstai";
                    break;
                case 'Friday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Perjantai";
                    break;
                case 'Saturday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Lauantai";
                    break;
                case 'Sunday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Sunnuntai";
                    break;
            }
        }
    }
    
    if(language == "Hem") {
        if(paiva.innerHTML == sunday) {
            paiva.innerHTML = "Söndag";
        }
        if(paiva.innerHTML == saturday) {
            paiva.innerHTML = "Lördag";
        }
        for(var i = 0; i<days.length; i++) {
            switch(days[i].getElementsByTagName("strong")[0].innerHTML) {
                case "Monday":
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Måndag";
                    break;
                case 'Tuesday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Tisdag";
                    break;
                case 'Wednesday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Onsdag";
                    break;
                case 'Thursday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Torsdag";
                    break;
                case 'Friday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Fridag";
                    break;
                case 'Saturday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Lördag";
                    break;
                case 'Sunday':
                    days[i].getElementsByTagName("strong")[0].innerHTML = "Söndag";
                    break;
            }
        }
    }

});