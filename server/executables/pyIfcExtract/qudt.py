# Not used at this moment. The most common architectural unit of measure in the EU, millimeter, is not in qudt.

class unit(str):
    def to_rdf(self):
        s = self.lower()
        if s.endswith('metre'): s = s[:-2] + 'er'
        return "qudt:%s"%s