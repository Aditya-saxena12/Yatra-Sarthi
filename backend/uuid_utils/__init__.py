import sys
from . import compat

# Ensure the mock is fully registered
sys.modules['uuid_utils'] = sys.modules[__name__]
