/*global CanvasShapes*/

CanvasShapes.GeometryTools = (function () {

    /**
     * Calculates the measure of an angle based on 3 points creating it. By
     * default it returns measure in degrees but it can return it in radians. To
     * do so simply pass `true` as fourth parameter. Coordinates of a point are
     * arrays in the following format: `[x, y]`.
     *
     * `p2` are coordinates of an apex.
     *
     * From law of cosines: http://en.wikipedia.org/wiki/Law_of_cosines
     *
     * @param {array}   p1
     * @param {array}   p2
     * @param {array}   p3
     * @param {boolean} radians [OPTIONAL]
     *
     * @return {float}
     */
    function angleMeasure (p1, p2, p3, radians) {

        var a = segmentLength(p2, p1),
            b = segmentLength(p2, p3),
            c = segmentLength(p1, p3),
            r = Math.acos(
                (a * a + b * b - c * c) / (2 * a * b)
            );

        if (radians === true) {
            return r;
        }

        return radiansToDegrees(r);
    }

    /**
     * Converts degrees measure to radians.
     *
     * @param  {float} degress
     * @return {float}
     */
    function degreesToRadians (degress) {
        return degress * Math.PI / 180;
    }

    /**
     * Converts radians measure to degrees.
     *
     * @param  {float} radians
     * @return {float}
     */
    function radiansToDegrees (radians) {
        return radians * 180 / Math.PI;
    }

    /**
     * Calculates a length of a segment defined by two points. Coordinates of a
     * point are arrays in the following format: `[x, y]`.
     *
     * @param {array} p1 coordinates
     * @param {array} p2 coordinates
     *
     * @return {float}
     */
    function segmentLength(p1, p2) {

        return Math.sqrt(
            Math.pow(p1[0] - p2[0], 2) +
            Math.pow(p1[1] - p2[1], 2)
        );
    }

    /**
     * Checks whether passed point lays within a polygon. Based on ray-casting
     * algorithm.
     *
     * @see http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     * @source https://github.com/substack/point-in-polygon
     *
     * @param {array} point
     * @param {array} polygonCoordinates
     *
     * @return {boolean}
     */
    function isInsidePolygon(point, polygonCoordinates, allowedError) {

        var i, j, k, xi, xj, yi, yj, intersect, xShift, yShift,
            x = point[0], y = point[1];

        function isInside(polygonCoordinates, xShift, yShift) {

            var inside = false;

            if (!xShift) {
                xShift = 0;
            }

            if (!yShift) {
                yShift = 0;
            }

            for (
                i = 0,
                j = polygonCoordinates.length - 1;
                i < polygonCoordinates.length;
                j = i++
            ) {
                xi = polygonCoordinates[i][0] + xShift;
                yi = polygonCoordinates[i][1] + yShift;
                xj = polygonCoordinates[j][0] + xShift;
                yj = polygonCoordinates[j][1] + yShift;

                intersect = ((yi > y) != (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

                if (intersect) {
                    inside = !inside;
                }
            }

            return inside;
        }

        if (!allowedError) {
            return isInside(polygonCoordinates);
        } else {
            for (k = 0; k < 4; k++) {
                // changing coordinates of a polygon to make it a little bit
                // bigger to accommodate allowed error
                switch (k) {
                    case 0:
                        xShift = allowedError;
                        yShift = allowedError;
                        break;
                    case 1:
                        xShift = allowedError;
                        yShift = -allowedError;
                        break;
                    case 2:
                        xShift = -allowedError;
                        yShift = allowedError;
                        break;
                    case 3:
                        xShift = -allowedError;
                        yShift = -allowedError;
                        break;
                }

                if (isInside(polygonCoordinates, xShift, yShift)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Measures the closest distance from a given point to a segment
     *
     * @see http://stackoverflow.com/a/6853926/571230
     *
     * @param {array} point
     * @param {array} lineCoordinates
     *
     * @return {float}
     */
    function distanceToSegment(point, lineCoordinates) {

        function distance(x, y, x1, y1, x2, y2) {

            var A = x - x1;
            var B = y - y1;
            var C = x2 - x1;
            var D = y2 - y1;

            var dot = A * C + B * D;
            var len_sq = C * C + D * D;
            var param = -1;
            if (len_sq !== 0) //in case of 0 length line
              param = dot / len_sq;

            var xx, yy;

            if (param < 0) {
            xx = x1;
            yy = y1;
            }
            else if (param > 1) {
            xx = x2;
            yy = y2;
            }
            else {
            xx = x1 + param * C;
            yy = y1 + param * D;
            }

            var dx = x - xx;
            var dy = y - yy;

            return Math.sqrt(dx * dx + dy * dy);
        }

        return distance(
            point[0], point[1], lineCoordinates[0][0], lineCoordinates[0][1],
            lineCoordinates[1][0], lineCoordinates[1][1]
        );
    }

    /**
     * Measures the closest distance from a given point to a line
     *
     * @see https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     *
     * @param {array} point
     * @param {array} lineCoordinates
     *
     * @return {float}
     */
    function distanceToLine(point, lineCoordinates) {

        function distance(x0, y0, x1, y1, x2, y2) {
            return Math.abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1) /
                Math.sqrt(Math.pow(y2-y1, 2) + Math.pow(x2-x1, 2));
        }

        return distance(
            point[0], point[1], lineCoordinates[0][0], lineCoordinates[0][1],
            lineCoordinates[1][0], lineCoordinates[1][1]
        );
    }

    /**
     * Checks whether a point lays on a line. `allowedError` allows you to
     * specify how close point should be to the line to be considered as laying
     * on it. Default is `0`.
     *
     * @param {array} point
     * @param {array} lineCoordinates
     * @param {float} allowedError
     *
     * @return {boolean}
     */
    function isOnTheLine(point, lineCoordinates, allowedError) {

        var distanceLine = distanceToLine(point, lineCoordinates);

        if (!allowedError) {
            allowedError = 0;
        }

        return CanvasShapes.Tools.isValueWithinInterval(
            distanceLine, 0 - allowedError, 0 + allowedError
        );
    }

    /**
     * Checks whether a point lays on a segment. `allowedError` allows you to
     * specify how close point should be to the line to be considered as laying
     * on it. Default is `0`.
     *
     * @param {array} point
     * @param {array} lineCoordinates
     * @param {float} allowedError
     *
     * @return {boolean}
     */
    function isOnTheSegment(point, lineCoordinates, allowedError) {

        var distanceSegment = distanceToSegment(point, lineCoordinates);

        if (!allowedError) {
            allowedError = 0;
        }

        return CanvasShapes.Tools.isValueWithinInterval(
            distanceSegment, 0 - allowedError, 0 + allowedError
        );
    }

    /**
     * Computes a factorial of a number.
     *
     * @source http://stackoverflow.com/a/3959275/571230
     *
     * @param  {integer} n
     * @return {integer}
     */
    function factorial(n) {
        var cache = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000, 620448401733239439360000, 15511210043330985984000000, 403291461126605635584000000, 10888869450418352160768000000, 304888344611713860501504000000, 8841761993739701954543616000000, 265252859812191058636308480000000, 8222838654177922817725562880000000, 263130836933693530167218012160000000, 8683317618811886495518194401280000000, 295232799039604140847618609643520000000, 10333147966386144929666651337523200000000, 371993326789901217467999448150835200000000, 13763753091226345046315979581580902400000000, 523022617466601111760007224100074291200000000, 20397882081197443358640281739902897356800000000, 815915283247897734345611269596115894272000000000, 33452526613163807108170062053440751665152000000000, 1405006117752879898543142606244511569936384000000000, 60415263063373835637355132068513997507264512000000000, 2658271574788448768043625811014615890319638528000000000, 119622220865480194561963161495657715064383733760000000000, 5502622159812088949850305428800254892961651752960000000000, 258623241511168180642964355153611979969197632389120000000000, 12413915592536072670862289047373375038521486354677760000000000, 608281864034267560872252163321295376887552831379210240000000000, 30414093201713378043612608166064768844377641568960512000000000000, 1551118753287382280224243016469303211063259720016986112000000000000, 80658175170943878571660636856403766975289505440883277824000000000000, 4274883284060025564298013753389399649690343788366813724672000000000000, 230843697339241380472092742683027581083278564571807941132288000000000000, 12696403353658275925965100847566516959580321051449436762275840000000000000, 710998587804863451854045647463724949736497978881168458687447040000000000000, 40526919504877216755680601905432322134980384796226602145184481280000000000000, 2350561331282878571829474910515074683828862318181142924420699914240000000000000, 138683118545689835737939019720389406345902876772687432540821294940160000000000000, 8320987112741390144276341183223364380754172606361245952449277696409600000000000000, 507580213877224798800856812176625227226004528988036003099405939480985600000000000000, 31469973260387937525653122354950764088012280797258232192163168247821107200000000000000, 1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000, 126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000, 8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000, 544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000, 36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000, 2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000, 171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000, 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000, 850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000, 61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000, 4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000, 330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000, 24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000, 1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000, 145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000, 11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000, 894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000, 71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000, 5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000, 475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000, 39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000, 3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000, 281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000, 24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000, 2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000, 185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000, 16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000, 1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000, 135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000, 12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000, 1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000, 108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000, 10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000, 991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000, 96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000, 9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000, 933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000, 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000];
        if (cache[n] > 0)
            return cache[n];
        cache[n] = factorial(n-1) * n;
        return cache[n];
    }

    /**
     * Computes a value of a binomial coefficient. Passed `index` can't be
     * bigger than a `degree`. Also both parameters can't be lower than 0.
     *
     * @see https://en.wikipedia.org/wiki/Binomial_coefficient
     *
     * @param {float} index
     * @param {float} degree
     *
     * @return {float}
     */
    function binomialCoefficient(index, degree) {
        if (index < 0 || degree < 0 || index > degree) {
            throw new CanvasShapes.Error(1069);
        }
        return factorial(degree) /
            (factorial(index) * factorial(degree - index));
    }

    /**
     * Computes a Bernstein polynomial value of n-th degree. `t` can't be lower
     * than 0 and bigger than 1, for Bernstein value to always be >= 0.
     *
     * @see https://en.wikipedia.org/wiki/Bernstein_polynomial
     *
     * @param {float} index
     * @param {float} degree
     * @param {float} t
     *
     * @return {float}
     */
    function bernstein(index, degree, t) {
        if (index < 0 || degree < 0 || t < 0 || t > 1) {
            throw new CanvasShapes.Error(1060);
        }
        return binomialCoefficient(index, degree) *
            Math.pow(t, index) * Math.pow(1 - t, degree - index);
    }

    return {
        angleMeasure: angleMeasure,
        segmentLength: segmentLength,
        radiansToDegrees: radiansToDegrees,
        degreesToRadians: degreesToRadians,
        isInsidePolygon: isInsidePolygon,
        distanceToLine: distanceToLine,
        distanceToSegment: distanceToSegment,
        isOnTheLine: isOnTheLine,
        isOnTheSegment: isOnTheSegment,
        factorial: factorial,
        binomialCoefficient: binomialCoefficient,
        bernstein: bernstein
    };
})();
