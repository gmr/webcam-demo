LESSC = `which lessc`
BOOTSTRAP = bower_components/bootstrap
COLORPICKER = bower_components/bootstrap-colorpicker
FONT_AWESOME = bower_components/font-awesome
LESS_INCLUDE = ${BOOTSTRAP}/less:${COLORPICKER}/less:${FONT_AWESOME}/less
LESS_IN = src/less/bootstrap.less
CSS_OUT = css/bootstrap.min.css

all: less run

bower:
	@( bower -s install )
	@( mkdir -p css fonts js )
	@( cp $(BOOTSTRAP)/dist/fonts/* fonts/ )
	@( cp $(FONT_AWESOME)/fonts/* fonts/ )

less:
	@( $(LESSC) --verbose -x --source-map=${CSS_OUT}.map --include-path=${LESS_INCLUDE} ${LESS_IN} ${CSS_OUT} )

run:
	python -m SimpleHTTPServer
