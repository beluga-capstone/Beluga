import re
from string import Template


class BelugaTemplate(Template):
    """
    Template override: Only allow Template to match on "#{}"
    ref: https://docs.python.org/3/library/string.html#string.Template.template
    """

    delimiter = "#"
    idpattern = r"[_a-z][_a-z0-9]+"
    braceidpattern = None
    pattern = rf"""
        {re.escape(delimiter)}(?:
            {{(?P<named>{idpattern})}}  |
            {{(?P<braced>{idpattern})}} |
            (?P<escaped>)               |
            (?P<invalid>)
        )
        """
