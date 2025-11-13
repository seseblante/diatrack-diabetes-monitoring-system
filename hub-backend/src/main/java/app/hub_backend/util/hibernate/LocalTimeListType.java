package app.hub_backend.util.hibernate;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import org.hibernate.usertype.DynamicParameterizedType;

import java.util.Properties;

public class LocalTimeListType extends ListArrayType implements DynamicParameterizedType {

    @Override
    public void setParameterValues(Properties parameters) {
        parameters.setProperty(
                PARAMETER_TYPE,
                "java.time.LocalTime"
        );
        super.setParameterValues(parameters);
    }
}