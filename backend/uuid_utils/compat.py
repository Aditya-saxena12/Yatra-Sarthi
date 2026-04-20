import uuid
import sys

# Define uuid7 as a wrapper for uuid4 since uuid7 
# is what langchain-core is specifically looking for.
def uuid7():
    return uuid.uuid4()

# Inject into sys.modules to prevent it from looking for the broken site-package version
sys.modules['uuid_utils.compat'] = sys.modules[__name__]
